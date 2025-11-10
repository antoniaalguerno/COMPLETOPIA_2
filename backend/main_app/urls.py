from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from core.urls import core_urlpatterns
from registration.urls import urlpatterns


urlpatterns = [
    path('',include(core_urlpatterns)),
    path('admin/', admin.site.urls),
    path('accounts/',include('django.contrib.auth.urls')),
    path('', include('registration.urls')),
    path('api/administrator/', include('administrator.urls')),
    path('api/administrator/', include('inventario.urls')),

]

admin.site.site_header = 'Administrador Bussiness_Solutions'
admin.site.site_title = 'bussinessSolutions'

if settings.DEBUG:
    urlpatterns +=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

