from django.urls import path
from .views import classify_image, get_pokemon_meta

urlpatterns = [
    path("classify_image", classify_image),
    path("get_pokemon_meta", get_pokemon_meta)
]
