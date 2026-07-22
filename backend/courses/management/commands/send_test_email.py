from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Wysyła testowy email potwierdzający konfigurację SMTP'

    def add_arguments(self, parser):
        parser.add_argument('email', nargs='?', default=settings.EMAIL_HOST_USER)

    def handle(self, *args, **options):
        recipient = options['email']
        send_mail(
            subject='Test wysyłki – Mc Med',
            message=(
                'Dzień dobry,\n\n'
                'To jest testowa wiadomość potwierdzająca poprawną konfigurację wysyłki maili w systemie Mc Med.\n\n'
                'Pozdrawiamy,\n'
                'Zespół Mc Med'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        self.stdout.write(self.style.SUCCESS(f'Mail wysłany na: {recipient}'))
