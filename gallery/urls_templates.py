from django.urls import path
from . import views_templates

app_name = 'gallery'

urlpatterns = [
    # Template views
    path('', views_templates.home, name='home'),
    path('gallery/', views_templates.gallery, name='gallery'),
    path('admin/', views_templates.admin_panel, name='admin_panel'),
    path('photo/upload/', views_templates.upload_photo, name='upload_photo'),
    path('category/create/', views_templates.create_category, name='create_category'),
    path('photo/<int:photo_id>/edit/', views_templates.edit_photo, name='edit_photo'),
    path('photo/<int:photo_id>/delete/', views_templates.delete_photo, name='delete_photo'),
    path('category/<int:category_id>/edit/', views_templates.edit_category, name='edit_category'),
    path('category/<int:category_id>/delete/', views_templates.delete_category, name='delete_category'),
]
