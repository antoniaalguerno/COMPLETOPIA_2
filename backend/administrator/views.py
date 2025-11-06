from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from registration.models import Profile  # Ajusta si tu modelo Profile está en otra app
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from administrator.models import Usuario
from registration.serializers import ProfileSerializer
from django.contrib.auth.models import Group



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

# 🔹 CAMBIAR CONTRASEÑA
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    new_password = request.data.get('new_password')
    if not new_password:
        return Response({'error': 'Debe ingresar una nueva contraseña'}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(new_password)
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
