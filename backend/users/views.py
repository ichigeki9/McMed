from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import ActivationToken


class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            activation = ActivationToken.objects.select_related('user').get(token=token)
        except ActivationToken.DoesNotExist:
            return Response(
                {'error': 'Nieprawidłowy link aktywacyjny.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not activation.is_valid:
            return Response(
                {'error': 'Link aktywacyjny wygasł lub został już użyty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = activation.user
        user.is_active = True
        user.save(update_fields=['is_active'])

        activation.is_used = True
        activation.save(update_fields=['is_used'])

        return Response({'message': 'Konto zostało aktywowane. Możesz się teraz zalogować.'})
