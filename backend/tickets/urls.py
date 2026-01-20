from django.urls import path
from .views import VerifyPaymentView, TicketDetailView, DashboardStatsView, TransactionListView, InitiatePaymentView, EventSettingsView, CheckInView
from .analytics_views import EventAnalyticsView, YearOverYearAnalyticsView
from .user_views import OrganizerListView, OrganizerCreateView, OrganizerDeleteView, CurrentUserView
from .inquiry_views import InquiryCreateView, InquiryListView, InquiryUnreadCountView, InquiryMarkReadView, InquiryMarkUnreadView
from .event_views import EventListCreateView, EventDetailView, EventSetActiveView
from .health_views import health_check

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('initiate-payment/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('ticket/<uuid:id>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('stats/', DashboardStatsView.as_view(), name='stats'),
    path('transactions/', TransactionListView.as_view(), name='transactions-list'),
    path('settings/', EventSettingsView.as_view(), name='event-settings'),
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('analytics/events/', EventAnalyticsView.as_view(), name='analytics-events'),
    path('analytics/yoy/', YearOverYearAnalyticsView.as_view(), name='analytics-yoy'),
    path('organizers/', OrganizerListView.as_view(), name='organizer-list'),
    path('organizers/create/', OrganizerCreateView.as_view(), name='organizer-create'),
    path('organizers/<int:id>/', OrganizerDeleteView.as_view(), name='organizer-delete'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('inquiries/', InquiryCreateView.as_view(), name='inquiry-create'),
    path('inquiries/list/', InquiryListView.as_view(), name='inquiry-list'),
    path('inquiries/unread-count/', InquiryUnreadCountView.as_view(), name='inquiry-unread-count'),
    path('inquiries/<int:id>/mark-read/', InquiryMarkReadView.as_view(), name='inquiry-mark-read'),
    path('inquiries/<int:id>/mark-unread/', InquiryMarkUnreadView.as_view(), name='inquiry-mark-unread'),
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:id>/', EventDetailView.as_view(), name='event-detail'),
    path('events/<int:id>/set-active/', EventSetActiveView.as_view(), name='event-set-active'),
]
