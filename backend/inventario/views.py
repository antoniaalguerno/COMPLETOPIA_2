# --- Imports Adicionales para DRF ---
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, serializers, permissions
from rest_framework.parsers import MultiPartParser, FormParser
import re # Ya lo tenías, pero es clave

# --- Modelos y otros (los que ya tenías) ---
from .models import Product
from registration.models import Profile
# ... otros imports ...

# -----------------------------------------------------------------
# 🔹 1. PERMISO PERSONALIZADO (para reemplazar la lógica group_id == 1)
# -----------------------------------------------------------------
class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a usuarios del grupo 1 (Admin).
    """
    message = 'No tienes permisos de administrador para realizar esta acción.'

    def has_permission(self, request, view):
        # Aseguramos que el usuario esté autenticado y tenga un perfil
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = Profile.objects.get(user=request.user)
            # Tu lógica original: permitir solo si group_id es 1
            return profile.group_id == 1
        except Profile.DoesNotExist:
            return False

# -----------------------------------------------------------------
# 🔹 2. SERIALIZER DEL PRODUCTO (Para convertir el modelo a JSON)
# -----------------------------------------------------------------
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 
            'supply_name', 
            'supply_code', 
            'supply_unit', 
            'supply_initial_stock', 
            'supply_input', 
            'supply_output', 
            'supply_total'
        ]

# -----------------------------------------------------------------
# 🔹 3. FUNCIÓN DE VALIDACIÓN (Extraída de tu lógica original)
# -----------------------------------------------------------------
def validar_nombre(nombre):
    """
    Valida que el nombre solo contenga letras y espacios.
    (Basado en tu lógica de carga masiva)
    """
    if not re.match(r'^[a-zA-Z\s]+$', nombre):
        return False
    return True

# -----------------------------------------------------------------
# 🔹 DASHBOARD: LISTAR PRODUCTOS CON BAJO STOCK
# -----------------------------------------------------------------
# Reemplaza a: inventario_main
# Consumido por: InventoryDashboard.tsx
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_low_stock_products(request):
    """
    Obtiene una lista de productos cuyo stock total es menor a 5.
    """
    # Usamos un filtro de ORM en lugar de un bucle para más eficiencia
    low_stock_products = Product.objects.filter(supply_total__lt=5).order_by('supply_name')
    
    # Serializamos los datos para la respuesta JSON
    serializer = ProductSerializer(low_stock_products, many=True)
    return Response(serializer.data)

# -----------------------------------------------------------------
# 🔹 CRUD: LISTAR (Y BUSCAR) TODOS LOS PRODUCTOS
# -----------------------------------------------------------------
# Reemplaza a: producto_list
# Consumido por: Inventory.tsx (para la tabla y la búsqueda)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_products(request):
    """
    Lista todos los productos. Acepta un parámetro 'q' para búsqueda.
    """
    search_query = request.GET.get('q', '')
    
    products = Product.objects.all().order_by('supply_name')
    
    if search_query:
        products = products.filter(supply_name__icontains=search_query)
        
    # Usamos .values() para ser consistentes con tu ejemplo de 'list_user_active'
    # Aunque ProductSerializer(products, many=True).data también sería perfecto.
    product_list = products.values(
        'id', 
        'supply_name', 
        'supply_code', 
        'supply_unit', 
        'supply_initial_stock', 
        'supply_input', 
        'supply_output', 
        'supply_total'
    )
    
    return Response(list(product_list))

# -----------------------------------------------------------------
# 🔹 CRUD: OBTENER DETALLE DE UN PRODUCTO
# -----------------------------------------------------------------
# Reemplaza a: producto_ver
# Consumido por: EditInventory.tsx (para cargar los datos en el formulario)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_product_detail(request, product_id):
    """
    Obtiene los detalles de un producto específico por su ID.
    """
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    serializer = ProductSerializer(product)
    
    # Tu vista 'producto_ver' también devolvía el código sin "SKU".
    # Podemos añadirlo si React lo necesita:
    data = serializer.data
    data['supply_code_numeric'] = re.sub(r'\D', '', product.supply_code)
    
    return Response(data)

# -----------------------------------------------------------------
# 🔹 CRUD: CREAR UN NUEVO PRODUCTO
# -----------------------------------------------------------------
# Reemplaza a: producto_save
# Consumido por: AddProduct.tsx
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_product(request):
    """
    Crea un nuevo producto.
    """
    data = request.data
    
    # --- Validación (replicando tu lógica de producto_save) ---
    supply_name = data.get('supply_name')
    supply_unit = data.get('supply_unit')
    supply_code_num = data.get('supply_code') # Ej: "1234" desde React
    supply_initial_stock = data.get('supply_initial_stock')
    
    # Asumimos que input/output son 0 al crear, como en tu lógica de carga masiva
    supply_input = data.get('supply_input', 0) 
    supply_output = data.get('supply_output', 0)

    if not all([supply_name, supply_unit, supply_code_num, supply_initial_stock is not None]):
        return Response({'error': 'Debes ingresar toda la información (nombre, unidad, código, stock inicial)'}, status=status.HTTP_400_BAD_REQUEST)

    if not validar_nombre(supply_name):
        return Response({'error': 'Debes ingresar un nombre válido'}, status=status.HTTP_400_BAD_REQUEST)

    if supply_unit not in ['kg', 'LATA (330 ml)']:
        return Response({'error': 'La unidad no es válida'}, status=status.HTTP_400_BAD_REQUEST)

    if not str(supply_initial_stock).isdigit():
        return Response({'error': 'El stock inicial debe ser un número entero'}, status=status.HTTP_400_BAD_REQUEST)

    supply_code = f'SKU{supply_code_num}'
    if not re.match(r'^SKU\d{4}$', supply_code):
        return Response({'error': 'El código del producto debe tener el formato SKU seguido de 4 dígitos'}, status=status.HTTP_400_BAD_REQUEST)
    # --- Fin Validación ---

    try:
        # Calculamos el total
        total = int(supply_initial_stock) + int(supply_input) - int(supply_output)
        
        product = Product.objects.create(
            supply_name=supply_name,
            supply_code=supply_code,
            supply_unit=supply_unit,
            supply_initial_stock=int(supply_initial_stock),
            supply_input=int(supply_input),
            supply_output=int(supply_output),
            supply_total=total,
        )
        
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------------------------------------
# 🔹 CRUD: ACTUALIZAR UN PRODUCTO
# -----------------------------------------------------------------
# Reemplaza a: producto_edit
# Consumido por: EditInventory.tsx
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_product(request, product_id):
    """
    Actualiza un producto existente.
    """
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    
    # --- Validación (replicando tu lógica de producto_edit) ---
    supply_name = data.get('supply_name')
    supply_code_num = data.get('supply_code') # Ej: "1234"
    supply_unit = data.get('supply_unit')
    supply_initial_stock = data.get('supply_initial_stock')
    supply_input = data.get('supply_input')
    supply_output = data.get('supply_output')

    if not all([supply_name, supply_unit, supply_code_num, 
                supply_initial_stock is not None, 
                supply_input is not None, 
                supply_output is not None]):
        return Response({'error': 'Debes ingresar toda la información'}, status=status.HTTP_400_BAD_REQUEST)

    if not validar_nombre(supply_name):
        return Response({'error': 'Debes ingresar un nombre de producto válido'}, status=status.HTTP_400_BAD_REQUEST)

    if supply_unit not in ['kg', 'LATA (330 ml)']:
        return Response({'error': 'La unidad no es válida'}, status=status.HTTP_400_BAD_REQUEST)

    if not all(str(val).isdigit() for val in [supply_initial_stock, supply_input, supply_output]):
        return Response({'error': 'El stock inicial, entrada y salida deben ser números enteros'}, status=status.HTTP_400_BAD_REQUEST)

    supply_code = f'SKU{supply_code_num}'
    if not re.match(r'^SKU\d{4}$', supply_code):
         return Response({'error': 'El código del producto debe tener el formato SKU seguido de 4 dígitos'}, status=status.HTTP_400_BAD_REQUEST)
    # --- Fin Validación ---

    # --- Lógica de negocio (replicando tu cálculo de stock) ---
    product.supply_name = supply_name
    product.supply_code = supply_code
    product.supply_unit = supply_unit
    product.supply_input = int(supply_input)
    product.supply_output = int(supply_output)

    # Comprobar si es la primera edición
    current_initial = int(supply_initial_stock)
    if str(product.supply_total) == str(product.supply_initial_stock):
        product.supply_initial_stock = current_initial
    else:
        # Si no es la primera edición, el "nuevo stock inicial" es el total anterior
        product.supply_initial_stock = product.supply_total

    # Calcular supply_total en base al 'supply_initial_stock' actualizado y los nuevos inputs/outputs
    product.supply_total = int(product.supply_initial_stock) + int(supply_input) - int(supply_output)
    
    product.save()
    
    serializer = ProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------------------------------------------
# 🔹 CRUD: ELIMINAR UN PRODUCTO
# -----------------------------------------------------------------
# Reemplaza a: producto_delete
# Consumido por: Inventory.tsx (botón de eliminar)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_product(request, product_id):
    """
    Elimina un producto por su ID.
    """
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
    product.delete()
    return Response({'message': 'Producto eliminado correctamente'}, status=status.HTTP_204_NO_CONTENT)


# -----------------------------------------------------------------
# 🔹 EXTRAS: IMPORTACIÓN / EXPORTACIÓN (Reportes y Carga)
# -----------------------------------------------------------------

# Reemplaza a: import_file_producto
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def download_template(request):
    """
    Descarga la plantilla Excel para la carga masiva.
    (La lógica interna es la misma, solo cambian los decoradores)
    """
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="archivo_importacion_producto.xlsx"'
    wb = Workbook()
    ws = wb.active
    ws.title = 'carga_masiva'
    columns = ['Producto', 'Código', 'Unidad', 'Stock inicial']
    ws.append(columns)
    example_data = ['ej: Palta', 'ej: SKU1111', 'ej: kg/LATA (330 ml)', 'ej: 10']
    ws.append(example_data)
    wb.save(response)
    return response

# Reemplaza a: carga_masiva_producto_save
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
@parser_classes([MultiPartParser, FormParser]) # Importante para recibir archivos
def upload_bulk_products(request):
    """
    Procesa un archivo Excel de carga masiva de productos.
    """
    if 'myfile' not in request.FILES:
        return Response({'error': 'No se encontró ningún archivo "myfile"'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        data = pd.read_excel(request.FILES['myfile'], engine='openpyxl', skiprows=1)
        df = pd.DataFrame(data)
        acc = 0
        for item in df.itertuples():
            supply_name = str(item[1])
            supply_code = str(item[2])
            supply_unit = str(item[3])
            supply_initial_stock = int(item[4])
            
            # (Tu lógica de validación de carga masiva...)
            if not validar_nombre(supply_name):
                 raise ValueError(f'El nombre del insumo "{supply_name}" solo puede contener letras')
            if supply_unit not in ['kg', 'LATA (330 ml)']:
                raise ValueError(f'La unidad "{supply_unit}" no es válida')
            if not isinstance(supply_initial_stock, int):
                raise ValueError(f'El stock inicial "{supply_initial_stock}" debe ser un número')

            Product.objects.create(
                supply_name=supply_name,
                supply_code=supply_code,
                supply_unit=supply_unit,
                supply_initial_stock=supply_initial_stock,
                supply_output=0,
                supply_input=0,
                supply_total=supply_initial_stock,
            )
            acc += 1

        return Response({'message': f'Carga masiva finalizada, se importaron {acc} registros'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': f'Error al procesar el archivo: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# Reemplaza a: descarga_reporte_producto
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def download_report_all(request):
    """
    Descarga un reporte en Excel con todos los productos.
    (Lógica interna idéntica, solo cambian decoradores)
    """
    try:
        style_2 = xlwt.easyxf('font: name Time New Roman, color-index black; font: bold on')
        font_style = xlwt.XFStyle()
        font_style.font.bold = True
        response=HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="ListaProductos.xls"'
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet('Productos')
        row_num = 0
        columns = ['Producto', 'Código', 'Unidad']
        for col_num in range(len(columns)):
            ws.write(row_num, col_num, columns[col_num] ,font_style)

        productos = Product.objects.all().order_by('supply_name')
        for row in productos:
            row_num += 1
            ws.write(row_num, 0, row.supply_name, style_2)
            ws.write(row_num, 1, row.supply_code, style_2) 
            ws.write(row_num, 2, row.supply_unit, style_2)
        
        wb.save(response)
        return response
    except Exception as e:
        return Response({'error': f'Se produjo un error al generar el archivo Excel: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Reemplaza a: reporte_producto_filtro
# NOTA: Cambiado de POST a GET para ser más estándar REST
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def download_report_filtered(request):
    """
    Descarga un reporte en Excel filtrado por nombre de producto.
    Usa un query param: /url/?q=nombre_producto
    """
    try:
        producto_query = request.GET.get('q', '') # Recibimos el filtro por query param
        if not producto_query:
            return Response({'error': 'El filtro "q" (producto) no puede estar vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Tu lógica asumía 'estado=Activo', la he quitado porque tu modelo Product no parece tener 'estado'
        productos_array = Product.objects.filter(supply_name__icontains=producto_query)
        
        if not productos_array.exists():
            return Response({'error': 'No existe producto con la cadena buscada'}, status=status.HTTP_404_NOT_FOUND)

        # (Tu lógica de creación de Excel...)
        style_2 = xlwt.easyxf('font: name Times New Roman, color-index black, bold on')
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = f'attachment; filename="ReporteProductos_{producto_query}.xls"'
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet('Productos')
        row_num = 0
        columns = ['Producto', 'Código', 'Unidad']
        for col_num in range(len(columns)):
            ws.write(row_num, col_num, columns[col_num], style_2)

        for row in productos_array:
            row_num += 1
            ws.write(row_num, 0, row.supply_name, style_2)
            ws.write(row_num, 1, row.supply_code, style_2)
            ws.write(row_num, 2, row.supply_unit, style_2)
        
        wb.save(response)
        return response
    except Exception as e:
        return Response({'error': f'Error al generar el reporte: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)