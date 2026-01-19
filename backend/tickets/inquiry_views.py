from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.paginator import Paginator
from .models import Inquiry
from .inquiry_serializers import InquirySerializer

class InquiryCreateView(APIView):
    """Public endpoint for creating inquiries from contact form"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = InquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Inquiry submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InquiryListView(APIView):
    """List all inquiries with pagination and search"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        inquiries = Inquiry.objects.all()
        
        # Search functionality
        search = request.query_params.get('search', '')
        if search:
            inquiries = inquiries.filter(
                name__icontains=search
            ) | inquiries.filter(
                email__icontains=search
            ) | inquiries.filter(
                phone__icontains=search
            ) | inquiries.filter(
                message__icontains=search
            )
        
        # Pagination
        page_number = request.query_params.get('page', 1)
        paginator = Paginator(inquiries, 10)
        page_obj = paginator.get_page(page_number)
        
        serializer = InquirySerializer(page_obj, many=True)
        return Response({
            'count': paginator.count,
            'next': page_obj.has_next(),
            'previous': page_obj.has_previous(),
            'results': serializer.data
        })

class InquiryUnreadCountView(APIView):
    """Get count of unread inquiries"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Inquiry.objects.filter(is_read=False).count()
        return Response({'unread_count': count})

class InquiryMarkReadView(APIView):
    """Mark inquiry as read"""
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, id):
        try:
            inquiry = Inquiry.objects.get(id=id)
            inquiry.is_read = True
            inquiry.save()
            return Response({'message': 'Marked as read'})
        except Inquiry.DoesNotExist:
            return Response({'error': 'Inquiry not found'}, status=status.HTTP_404_NOT_FOUND)

class InquiryMarkUnreadView(APIView):
    """Mark inquiry as unread"""
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, id):
        try:
            inquiry = Inquiry.objects.get(id=id)
            inquiry.is_read = False
            inquiry.save()
            return Response({'message': 'Marked as unread'})
        except Inquiry.DoesNotExist:
            return Response({'error': 'Inquiry not found'}, status=status.HTTP_404_NOT_FOUND)
