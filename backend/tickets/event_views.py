from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Event
from .serializers import EventSerializer

class EventListCreateView(APIView):
    """List all events or create a new event"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        events = Event.objects.all().order_by('-is_active', '-id')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetailView(APIView):
    """Retrieve, update or delete an event"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, id):
        try:
            event = Event.objects.get(id=id)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, id):
        try:
            event = Event.objects.get(id=id)
            serializer = EventSerializer(event, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, id):
        try:
            event = Event.objects.get(id=id)
            if event.is_active:
                return Response({'error': 'Cannot delete active event'}, status=status.HTTP_400_BAD_REQUEST)
            event.delete()
            return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

class EventSetActiveView(APIView):
    """Set an event as active (deactivates all others)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, id):
        try:
            # Deactivate all events
            Event.objects.all().update(is_active=False)
            
            # Activate the selected event
            event = Event.objects.get(id=id)
            event.is_active = True
            event.save()
            
            return Response({'message': 'Event set as active successfully'})
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
