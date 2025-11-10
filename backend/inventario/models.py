from django.db import models
from django.contrib.auth.models import Group, User 


"""
    Modelo que representa un producto en el inventario.

    Atributos:
    - supply_name: Nombre del producto.
    - supply_code: Código del producto.
    - supply_unit: Unidad de medida del producto.
    - supply_initial_stock: Stock inicial del producto.
    - supply_input: Entrada de stock del producto.
    - supply_output: Salida de stock del producto.
    - supply_total: Stock total actual del producto.

    Métodos:
    - get_nombre_producto(): Retorna el nombre del producto junto con su unidad de medida.

    Meta:
    - verbose_name: Nombre singular del modelo en el panel de administración.
    - verbose_name_plural: Nombre plural del modelo en el panel de administración.
    - ordering: Orden predeterminado para las consultas, ordenado por nombre del producto.
"""