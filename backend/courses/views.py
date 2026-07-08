from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Course, Enrollment
from .serializers import CourseSerializer, AdminCourseSerializer, EnrollmentSerializer


class PublicCourseListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = CourseSerializer
    queryset           = Course.objects.filter(is_active=True)


class PublicEnrollView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class   = EnrollmentSerializer


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
