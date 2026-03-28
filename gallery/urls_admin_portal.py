from django.urls import path
from . import admin_auth_views

app_name = 'gallery'

urlpatterns = [
    # Admin portal authentication
    path('admin-portal/login/', admin_auth_views.admin_portal_login, name='admin_portal_login'),
    path('admin-portal/logout/', admin_auth_views.admin_portal_logout, name='admin_portal_logout'),
    
    # Admin portal dashboard
    path('admin-portal/dashboard/', admin_auth_views.admin_portal_dashboard, name='admin_portal_dashboard'),
    
    # Photo management in admin portal
    path('admin-portal/photos/upload/', admin_auth_views.admin_portal_upload_photo, name='admin_portal_upload_photo'),
    path('admin-portal/photos/manage/', admin_auth_views.admin_portal_manage_photos, name='admin_portal_manage_photos'),
    path('admin-portal/photos/<int:photo_id>/delete/', admin_auth_views.admin_portal_delete_photo, name='admin_portal_delete_photo'),
    
    # Category management in admin portal
    path('admin-portal/categories/create/', admin_auth_views.admin_portal_create_category, name='admin_portal_create_category'),
    path('admin-portal/categories/manage/', admin_auth_views.admin_portal_manage_categories, name='admin_portal_manage_categories'),
    path('admin-portal/categories/<int:category_id>/delete/', admin_auth_views.admin_portal_delete_category, name='admin_portal_delete_category'),
]
