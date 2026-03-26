from django.urls import path
from . import admin_views

app_name = 'gallery'

urlpatterns = [
    # Admin authentication
    path('admin/login/', admin_views.admin_login, name='admin_login'),
    path('admin/logout/', admin_views.admin_logout, name='admin_logout'),
    
    # Admin dashboard
    path('admin/dashboard/', admin_views.admin_dashboard, name='admin_dashboard'),
    
    # Photo management
    path('admin/photos/upload/', admin_views.upload_photo_form, name='upload_photo_form'),
    path('admin/photos/manage/', admin_views.manage_photos, name='manage_photos'),
    path('admin/photos/<int:photo_id>/edit/', admin_views.edit_photo, name='edit_photo'),
    path('admin/photos/<int:photo_id>/delete/', admin_views.delete_photo, name='delete_photo'),
    
    # Category management
    path('admin/categories/create/', admin_views.create_category_form, name='create_category_form'),
    path('admin/categories/manage/', admin_views.manage_categories, name='manage_categories'),
    path('admin/categories/<int:category_id>/edit/', admin_views.edit_category, name='edit_category'),
    path('admin/categories/<int:category_id>/delete/', admin_views.delete_category, name='delete_category'),
]
