from django.urls import path
from .views import login_view, register_view, profile_view, update_profile

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/register/', register_view, name='register'),
    path('api/profile/', profile_view, name='profile'),
    path('api/profile/update/', update_profile, name='update_profile'),
]
