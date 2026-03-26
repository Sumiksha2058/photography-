from django.urls import path
from . import views

app_name = 'gallery'

urlpatterns = [
    # Photo endpoints
    path('api/photos/', views.get_photos, name='get_photos'),
    path('api/photos/<int:photo_id>/', views.get_photo_detail, name='get_photo_detail'),
    path('api/photos/create/', views.create_photo, name='create_photo'),
    path('api/photos/<int:photo_id>/update/', views.update_photo, name='update_photo'),
    path('api/photos/<int:photo_id>/delete/', views.delete_photo, name='delete_photo'),
    
    # Category endpoints
    path('api/categories/', views.get_categories, name='get_categories'),
    path('api/categories/create/', views.create_category, name='create_category'),
    path('api/categories/<int:category_id>/update/', views.update_category, name='update_category'),
    path('api/categories/<int:category_id>/delete/', views.delete_category, name='delete_category'),
]
