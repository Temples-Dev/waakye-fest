from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'paystack_reference', 'verified', 'checked_in', 'created_at')
    list_filter = ('verified', 'checked_in', 'created_at')
    search_fields = ('name', 'email', 'phone_number', 'paystack_reference')
    readonly_fields = ('created_at', 'paystack_reference')
    ordering = ('-created_at',)
