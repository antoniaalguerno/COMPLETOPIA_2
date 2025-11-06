from django.urls import path
from . import views

urlpatterns = [
    # Listados
    path('users/active/', views.list_user_active, name='list_user_active'),
    path('users/blocked/', views.list_user_block, name='list_user_block'),

    # 🔹 Busquedas
    path('users/search/active/', views.search_users_active, name='search_users_active'),
    path('users/search/blocked/', views.search_users_blocked, name='search_users_blocked'),

    # CRUD
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:user_id>/', views.user_detail_view, name='user_detail_view'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),

    # Bloqueo / Activación
    path('users/<int:user_id>/block/', views.block_user, name='block_user'),
    path('users/<int:user_id>/activate/', views.activate_user, name='activate_user'),

    # Contraseña
    path('users/<int:user_id>/password/', views.change_password, name='change_password'),
]
