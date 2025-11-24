# ✅ Modelo Corregido (Recomendado)
from django.db import models
from django.contrib.auth.models import Group, User 

class Product(models.Model):
    # Campos de texto. Quitamos null=True y blank=True 
    # para que sean obligatorios.
    supply_name = models.CharField(max_length=100)
    supply_code = models.CharField(max_length=240, unique=True) # unique=True es buena idea
    supply_unit = models.CharField(max_length=50) # 50 es más que suficiente

    # Campos numéricos. Usamos IntegerField.
    # default=0 para que siempre tengan un valor numérico.
    supply_initial_stock = models.IntegerField(default=0)
    supply_input = models.IntegerField(default=0)
    supply_output = models.IntegerField(default=0)
    supply_total =  models.IntegerField(default=0)

    def get_nombre_producto(self):
        return f'{self.supply_name} ({self.supply_unit})'
    
    class Meta:
        managed = False
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['supply_name']
    
    def __str__(self):
        return self.supply_name
