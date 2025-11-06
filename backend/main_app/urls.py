from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from administrator.urls import administrator_patterns
from core.urls import core_urlpatterns
from inventario.urls import inventario_patterns
from registration.urls import urlpatterns


urlpatterns = [
    path('',include(core_urlpatterns)),
    path("administrator/",include(administrator_patterns)),
    path("inventario/",include(inventario_patterns)),
    path('admin/', admin.site.urls),
    path('accounts/',include('django.contrib.auth.urls')),
    path('', include('registration.urls')),

]

admin.site.site_header = 'Administrador Bussiness_Solutions'
admin.site.site_title = 'bussinessSolutions'

if settings.DEBUG:
    urlpatterns +=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

