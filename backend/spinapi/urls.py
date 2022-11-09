from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'pizzas', views.PizzaViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'menu', views.MenuViewSet)
# router.register(r'price',views.PriceView.as_view(),basename='price')



# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('price', views.PriceView.as_view(), name='price'),
    path('available_ingredients', views.AvailableIngredientsView.as_view(), name='available_ingredients')
]