from django.urls import path
from . import views  # Usamos import relativo

#
# Estas son las NUEVAS URLs para la API que se conectará con React.
# Reemplazan las URLs antiguas que renderizaban plantillas.
#
urlpatterns = [
    
    # 🔹 Dashboard
    # Reemplaza a 'inventario_main'
    # GET /api/inventario/low-stock/
    path('low-stock/', views.list_low_stock_products, name='api_low_stock_products'),

    # 🔹 CRUD de Productos
    # Reemplaza a 'producto_list' (y maneja la búsqueda con ?q=...)
    # GET /api/inventario/products/
    path('products/', views.list_products, name='api_list_products'),
    
    # Reemplaza a 'crear_producto' y 'producto_save'
    # POST /api/inventario/products/create/
    path('products/create/', views.create_product, name='api_create_product'),
    
    # Reemplaza a 'producto_ver'
    # GET /api/inventario/products/<id>/
    path('products/<int:product_id>/', views.get_product_detail, name='api_get_product_detail'),
    
    # Reemplaza a 'producto_edit'
    # PUT /api/inventario/products/<id>/update/
    path('products/<int:product_id>/update/', views.update_product, name='api_update_product'),
    
    # Reemplaza a 'producto_delete'
    # DELETE /api/inventario/products/<id>/delete/
    path('products/<int:product_id>/delete/', views.delete_product, name='api_delete_product'),

    # 🔹 Reportes y Carga Masiva
    # Reemplaza a 'import_file_producto'
    # GET /api/inventario/download-template/
    path('download-template/', views.download_template, name='api_download_template'),
    
    # Reemplaza a 'carga_masiva_producto_save'
    # POST /api/inventario/upload-bulk/
    path('upload-bulk/', views.upload_bulk_products, name='api_upload_bulk'),
    
    # Reemplaza a 'descarga_reporte_producto'
    # GET /api/inventario/download-report/all/
    path('download-report/all/', views.download_report_all, name='api_download_report_all'),
    
    # Reemplaza a 'reporte_producto_filtro' (ahora usa ?q=...)
    # GET /api/inventario/download-report/filtered/
    path('download-report/filtered/', views.download_report_filtered, name='api_download_report_filtered'),
    
]

# ---------------------------------------------------------------------------
# NOTA: Las siguientes URLs de tu archivo original ya no son necesarias
# porque sus vistas (formularios en HTML) ahora son manejadas por React:
#
# - path('crear_producto/',views.crear_producto,name='crear_producto'),
# - path('carga_masiva_producto/',views.carga_masiva_producto,name="carga_masiva_producto"),
# - path('reportes_main_productos/',views.reportes_main_productos,name="reportes_main_productos"),
# - Y las que guardaban datos (como producto_save) han sido reemplazadas 
#   por las vistas de API (como create_product).
# ---------------------------------------------------------------------------