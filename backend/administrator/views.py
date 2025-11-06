from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from registration.models import Profile  # Ajusta si tu modelo Profile está en otra app
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from administrator.models import Usuario
from registration.serializers import ProfileSerializer
from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password

import json

# 🔹 LISTAR TODOS LOS USUARIOS ACTIVOS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_active(request):
    users = User.objects.filter(is_active=True).values(
        'id', 'first_name', 'last_name', 'email', 'is_active'
    )
    return Response(list(users))

# 🔹 LISTAR USUARIOS BLOQUEADOS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_block(request):
    users = User.objects.filter(is_active=False).values(
        'id', 'first_name', 'last_name', 'email', 'is_active'
    )
    return Response(list(users))

# 🔹 DETALLE DE UN USUARIO
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'mobile': profile.mobile,
            'rut': profile.rut,
            'address': profile.address,
            'region': profile.region,
            'comuna': profile.comuna,
            'profile_image': request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None,
            'is_active': user.is_active
        }

        return Response(data)

    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    data = request.data
    try:
        # Crear User
        user = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            password=data.get('password', '12345678')
        )

        # Asignar grupo
        group_id = data.get('group', 1)
        group = Group.objects.get(id=group_id)

        # Crear Profile
        profile = Profile(
            user=user,
            username=data.get('username', ''),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=data.get('email', ''),
            group=group,
            rut=data.get('run', ''),
            mobile=data.get('mobile', ''),
            address=data.get('direccion', ''),
            region=data.get('region', ''),
            comuna=data.get('comuna', ''),
        )
        if 'profile_image' in request.FILES:
            profile.profile_image = request.FILES['profile_image']
        profile.save()

        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # Actualizar User
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    # email lo dejamos readOnly si quieres, pero aquí se puede actualizar si envías
    user.email = data.get('email', user.email)
    user.save()

    # Actualizar Profile
    profile.mobile = data.get('mobile', profile.mobile)
    profile.first_name = data.get('first_name', profile.first_name)
    profile.last_name = data.get('last_name', profile.last_name)
    profile.address = data.get('direccion', profile.address)
    profile.region = data.get('region', profile.region)
    profile.comuna = data.get('comuna', profile.comuna)

    # Foto de perfil
    if 'profile_image' in request.FILES:
        profile.profile_image = request.FILES['profile_image']

    profile.save()

    return Response({'message': 'Usuario actualizado correctamente'})


# 🔹 BLOQUEAR USUARIO (desactivar)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = False
        user.save()
        return Response({'message': 'Usuario bloqueado correctamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

# 🔹 ACTIVAR USUARIO
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def activate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True
        user.save()
        return Response({'message': 'Usuario activado correctamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

# 🔹 CAMBIAR CONTRASEÑA CON VERIFICACIÓN DE LA ACTUAL
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({'error': 'Debe ingresar la contraseña actual y la nueva'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar que la contraseña actual es correcta
    if not user.check_password(current_password):
        return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

    # Cambiar la contraseña
    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)

    return Response({'message': 'Contraseña cambiada correctamente'})


# 🔹 BUSCAR USUARIOS
# ACTIVOS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users_active(request):
    query = request.GET.get('q', '')
    users = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query),
        is_active=True
    ).values('id', 'first_name', 'last_name', 'email', 'is_active')
    return Response(list(users))


# BLOCK
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users_blocked(request):
    query = request.GET.get('q', '')
    users = User.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query),
        is_active=False
    ).values('id', 'first_name', 'last_name', 'email', 'is_active')
    return Response(list(users))

@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_password_email(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Debe proporcionar un correo'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Construir link que será enviado por email
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

    # Enviar correo
    send_mail(
        subject='Restablecer contraseña',
        message=f'Hola {user.first_name},\n\nUse este enlace para restablecer su contraseña:\n{reset_link}',
        from_email=None,  # Django tomará DEFAULT_FROM_EMAIL
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({'message': 'Correo enviado con instrucciones para restablecer la contraseña'})

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def reset_password_confirm(request, uid, token):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)
        new_password = data.get('new_password')
        if not new_password:
            return JsonResponse({'error': 'Debe proporcionar una nueva contraseña'}, status=400)

        # Decodificar UID
        uid = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=uid)

        # Verificar token
        if not default_token_generator.check_token(user, token):
            return JsonResponse({'error': 'Token inválido o expirado'}, status=400)

        # Actualizar contraseña
        user.set_password(new_password)
        user.save()


        return JsonResponse({'message': 'Contraseña restablecida correctamente'}, status=200)

    except User.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
