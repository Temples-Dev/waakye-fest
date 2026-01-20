from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError

def health_check(request):
    """
    Health check endpoint for deployment platforms.
    Returns 200 OK if the application and database are healthy.
    """
    try:
        # Check database connection
        db_conn = connections['default']
        db_conn.cursor()
        
        return JsonResponse({
            'status': 'healthy',
            'database': 'connected'
        }, status=200)
    except OperationalError:
        return JsonResponse({
            'status': 'unhealthy',
            'database': 'disconnected'
        }, status=503)
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=503)
