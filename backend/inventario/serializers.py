from rest_framework import serializers
from .models import Product

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
            'supply_total',
        ]
