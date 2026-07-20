from django.contrib import admin
from .models import ActivationToken


@admin.register(ActivationToken)
class ActivationTokenAdmin(admin.ModelAdmin):
    list_display  = ('user', 'token', 'created_at', 'expires_at', 'is_used')
    list_filter   = ('is_used',)
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('token', 'created_at', 'expires_at')
