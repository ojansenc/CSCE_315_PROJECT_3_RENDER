from rest_framework import serializers
from .models import Pizzas, Ingredients, Orders, Menu


# these classes are in charge of converting the database rows to JSON objects
# Python notation is that class B(A) means that Class B extends Class A
class PizzaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pizzas
        # you can pick which fields you want to allow to be visible in the JSON file
        # this list basically says get all instance variables of the Pizza class and convert
        # them to strings
        fields = [f.name for f in Pizzas._meta.get_fields()]


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Orders
        # skip meta field for many to one relation 
        fields = [f.name for f in Orders._meta.get_fields()]
        print(fields)
        

class MenuSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Menu
        fields = [f.name for f in Menu._meta.get_fields()]


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredients
        fields = [f.name for f in Ingredients._meta.get_fields()]
    
    

class PriceSerializer(serializers.Serializer):
    price = serializers.DecimalField(max_digits=4,decimal_places=2)

class AvailableIngredientsSerializer(serializers.Serializer):
    ingredient_name = serializers.CharField(max_length=100)
    ingr_type = serializers.CharField(max_length=100)