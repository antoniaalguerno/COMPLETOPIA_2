from django.urls import path
from . import views

urlpatterns = [
    path('users/active/', views.list_user_active, name='list_user_active'),
    path('users/blocked/', views.list_user_block, name='list_user_block'),
    path('users/search/', views.search_users, name='search_users'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:user_id>/', views.user_detail_view, name='user_detail_view'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),
    path('users/<int:user_id>/block/', views.block_user, name='block_user'),
    path('users/<int:user_id>/activate/', views.activate_user, name='activate_user'),
    path('users/<int:user_id>/password/', views.change_password, name='change_password'),
]
