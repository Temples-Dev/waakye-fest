from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'email', 'phone_number', 'paystack_reference', 'verified', 'checked_in', 'created_at']
        read_only_fields = ['id', 'verified', 'checked_in', 'created_at']
