from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Course, Enrollment
from .serializers import CourseSerializer, AdminCourseSerializer, EnrollmentSerializer

User = get_user_model()


class PublicCourseListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = CourseSerializer
    queryset           = Course.objects.filter(is_active=True)


class PublicEnrollView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class   = EnrollmentSerializer

    def create(self, request, *args, **kwargs):
        login    = request.data.get('login', '').strip()
        password = request.data.get('password', '')

        # Walidacja pól konta przed walidacją reszty formularza
        account_errors = {}
        if not login:
            account_errors['login'] = 'Podaj login.'
        elif User.objects.filter(username=login).exists():
            account_errors['login'] = 'Ten login jest już zajęty.'
        if len(password) < 8:
            account_errors['password'] = 'Hasło musi mieć min. 8 znaków.'
        if account_errors:
            return Response(account_errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        vd = serializer.validated_data
        email      = vd.get('email', '')
        first_name = vd.get('first_name', '')
        last_name  = vd.get('last_name', '')

        with transaction.atomic():
            user = User.objects.create_user(
                username=login,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_active=False,
            )
            enrollment = serializer.save(user=user)

            from users.models import ActivationToken
            activation = ActivationToken.objects.create(user=user)

        self._send_enrollment_email(enrollment, activation.token)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def _send_enrollment_email(self, enrollment, token):
        if not enrollment.email:
            return

        course      = enrollment.course
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        activation_link = f'{frontend_url}/aktywuj/{token}'

        def fmt(d):
            return d.strftime('%d.%m.%Y') if d else '–'

        body = (
            f'Dzień dobry {enrollment.first_name},\n\n'
            f'Twoje zgłoszenie na kurs zostało przyjęte!\n\n'
            f'Kurs:    {course.name}\n'
            f'Termin:  {fmt(course.start_date)} – {fmt(course.end_date)}\n'
            f'Miejsce: {course.city}\n'
            f'Cena:    {course.price} zł\n\n'
            f'─────────────────────────────────────\n'
            f'Aktywuj swoje konto\n'
            f'─────────────────────────────────────\n'
            f'Kliknij w poniższy link, aby aktywować konto i uzyskać dostęp\n'
            f'do materiałów szkoleniowych, harmonogramu i wyników egzaminu:\n\n'
            f'{activation_link}\n\n'
            f'Link jest ważny przez 72 godziny.\n\n'
            f'─────────────────────────────────────\n'
            f'Skontaktujemy się z Tobą telefonicznie w celu potwierdzenia zapisu.\n\n'
            f'Pozdrawiamy,\n'
            f'Zespół Mc Med'
        )

        send_mail(
            subject='Potwierdzenie zapisu i aktywacja konta – Mc Med',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[enrollment.email],
            fail_silently=True,
        )


class AdminCourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = AdminCourseSerializer
    queryset           = Course.objects.all()


class AdminCourseCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = AdminCourseSerializer


class AdminCourseDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = AdminCourseSerializer
    queryset           = Course.objects.all()
    http_method_names  = ['get', 'patch']


class AdminEnrollmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = EnrollmentSerializer

    def get_queryset(self):
        qs = Enrollment.objects.select_related('course')
        course_id = self.request.query_params.get('course')
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs


class AdminEnrollmentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset           = Enrollment.objects.all()
