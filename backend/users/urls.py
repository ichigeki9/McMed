from django.urls import path
from .views import ActivateAccountView

urlpatterns = [
    path('activate/<uuid:token>/', ActivateAccountView.as_view(), name='activate-account'),
]
