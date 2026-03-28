from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.contrib import messages
import secrets
import hashlib
from .admin_auth_models import AdminUser, AdminSession, AdminAuditLog
from .models import Photo, Category


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """Get user agent from request"""
    return request.META.get('HTTP_USER_AGENT', '')


def create_session_token():
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)


def admin_portal_login(request):
    """
    Admin portal login page with unique authentication
    URL: /admin-portal/login/
    """
    # Check if already logged in
    session_token = request.COOKIES.get('admin_session_token')
    if session_token:
        try:
            session = AdminSession.objects.get(session_token=session_token, is_active=True)
            return redirect('gallery:admin_portal_dashboard')
        except AdminSession.DoesNotExist:
            pass
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        
        if not username or not password:
            messages.error(request, 'Username and password are required.')
            return render(request, 'gallery/admin_portal_login.html')
        
        try:
            admin = AdminUser.objects.get(username=username, is_active=True)
            
            if admin.check_password(password):
                # Create session
                session_token = create_session_token()
                ip_address = get_client_ip(request)
                user_agent = get_user_agent(request)
                
                session = AdminSession.objects.create(
                    admin=admin,
                    session_token=session_token,
                    ip_address=ip_address,
                    user_agent=user_agent,
                )
                
                # Update last login
                admin.last_login = timezone.now()
                admin.save()
                
                # Log the action
                AdminAuditLog.objects.create(
                    admin=admin,
                    action='LOGIN',
                    description=f'Admin logged in from {ip_address}',
                    ip_address=ip_address,
                )
                
                # Create response with session cookie
                response = redirect('gallery:admin_portal_dashboard')
                response.set_cookie(
                    'admin_session_token',
                    session_token,
                    max_age=86400 * 7,  # 7 days
                    httponly=True,
                    secure=True,
                    samesite='Lax'
                )
                
                messages.success(request, f'Welcome back, {admin.full_name or admin.username}!')
                return response
            else:
                # Log failed attempt
                AdminAuditLog.objects.create(
                    admin=admin,
                    action='LOGIN',
                    description=f'Failed login attempt from {get_client_ip(request)}',
                    ip_address=get_client_ip(request),
                )
                messages.error(request, 'Invalid credentials.')
        except AdminUser.DoesNotExist:
            messages.error(request, 'Admin account not found.')
    
    return render(request, 'gallery/admin_portal_login.html')


def admin_portal_logout(request):
    """
    Admin portal logout
    """
    session_token = request.COOKIES.get('admin_session_token')
    
    if session_token:
        try:
            session = AdminSession.objects.get(session_token=session_token)
            admin = session.admin
            
            # Log the logout
            AdminAuditLog.objects.create(
                admin=admin,
                action='LOGOUT',
                description=f'Admin logged out',
                ip_address=get_client_ip(request),
            )
            
            # Deactivate session
            session.is_active = False
            session.save()
        except AdminSession.DoesNotExist:
            pass
    
    response = redirect('gallery:admin_portal_login')
    response.delete_cookie('admin_session_token')
    messages.success(request, 'You have been logged out.')
    return response


def check_admin_session(request):
    """
    Middleware-like function to check if user has valid admin session
    """
    session_token = request.COOKIES.get('admin_session_token')
    
    if not session_token:
        return None
    
    try:
        session = AdminSession.objects.get(session_token=session_token, is_active=True)
        # Update last activity
        session.last_activity = timezone.now()
        session.save()
        return session.admin
    except AdminSession.DoesNotExist:
        return None


def admin_portal_dashboard(request):
    """
    Admin portal dashboard
    URL: /admin-portal/dashboard/
    """
    admin = check_admin_session(request)
    
    if not admin:
        messages.error(request, 'Please log in to access the admin portal.')
        return redirect('gallery:admin_portal_login')
    
    if not admin.is_active:
        messages.error(request, 'Your admin account has been deactivated.')
        return redirect('gallery:admin_portal_login')
    
    # Get statistics
    photos = Photo.objects.all()
    categories = Category.objects.all()
    
    total_photos = photos.count()
    total_categories = categories.count()
    total_views = sum(photo.views for photo in photos)
    recent_photos = photos.order_by('-created_at')[:10]
    
    # Get recent audit logs
    recent_logs = AdminAuditLog.objects.filter(admin=admin).order_by('-timestamp')[:10]
    
    context = {
        'admin': admin,
        'total_photos': total_photos,
        'total_categories': total_categories,
        'total_views': total_views,
        'recent_photos': recent_photos,
        'recent_logs': recent_logs,
    }
    
    return render(request, 'gallery/admin_portal_dashboard.html', context)


def admin_portal_upload_photo(request):
    """
    Upload photo in admin portal
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_photos:
        messages.error(request, 'You do not have permission to upload photos.')
        return redirect('gallery:admin_portal_dashboard')
    
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        category_id = request.POST.get('category')
        is_featured = request.POST.get('is_featured') == 'on'
        image = request.FILES.get('image')
        
        if not title:
            messages.error(request, 'Photo title is required.')
            return render(request, 'gallery/admin_portal_upload_photo.html', {'categories': Category.objects.all()})
        
        if not image:
            messages.error(request, 'Photo image is required.')
            return render(request, 'gallery/admin_portal_upload_photo.html', {'categories': Category.objects.all()})
        
        try:
            photo = Photo.objects.create(
                title=title,
                description=description,
                category_id=category_id if category_id else None,
                image=image,
                uploaded_by=None,  # Not using Django user
                is_featured=is_featured,
            )
            
            # Log the action
            AdminAuditLog.objects.create(
                admin=admin,
                action='UPLOAD_PHOTO',
                description=f'Uploaded photo: {title}',
                ip_address=get_client_ip(request),
            )
            
            messages.success(request, f'Photo "{title}" uploaded successfully!')
            return redirect('gallery:admin_portal_manage_photos')
        except Exception as e:
            messages.error(request, f'Error uploading photo: {str(e)}')
    
    categories = Category.objects.all()
    context = {'admin': admin, 'categories': categories}
    return render(request, 'gallery/admin_portal_upload_photo.html', context)


def admin_portal_manage_photos(request):
    """
    Manage all photos in admin portal
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_photos:
        messages.error(request, 'You do not have permission to manage photos.')
        return redirect('gallery:admin_portal_dashboard')
    
    photos = Photo.objects.all().order_by('-created_at')
    context = {'admin': admin, 'photos': photos}
    return render(request, 'gallery/admin_portal_manage_photos.html', context)


def admin_portal_delete_photo(request, photo_id):
    """
    Delete a photo
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_photos:
        messages.error(request, 'You do not have permission to delete photos.')
        return redirect('gallery:admin_portal_dashboard')
    
    try:
        photo = Photo.objects.get(id=photo_id)
        title = photo.title
        photo.delete()
        
        # Log the action
        AdminAuditLog.objects.create(
            admin=admin,
            action='DELETE_PHOTO',
            description=f'Deleted photo: {title}',
            ip_address=get_client_ip(request),
        )
        
        messages.success(request, f'Photo "{title}" deleted successfully!')
    except Photo.DoesNotExist:
        messages.error(request, 'Photo not found.')
    
    return redirect('gallery:admin_portal_manage_photos')


def admin_portal_manage_categories(request):
    """
    Manage all categories in admin portal
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_categories:
        messages.error(request, 'You do not have permission to manage categories.')
        return redirect('gallery:admin_portal_dashboard')
    
    categories = Category.objects.all().order_by('name')
    
    for category in categories:
        category.photo_count = category.photo_set.count()
    
    context = {'admin': admin, 'categories': categories}
    return render(request, 'gallery/admin_portal_manage_categories.html', context)


def admin_portal_create_category(request):
    """
    Create a new category
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_categories:
        messages.error(request, 'You do not have permission to create categories.')
        return redirect('gallery:admin_portal_dashboard')
    
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        slug = request.POST.get('slug', '').strip()
        description = request.POST.get('description', '').strip()
        
        if not name or not slug:
            messages.error(request, 'Category name and slug are required.')
            return render(request, 'gallery/admin_portal_create_category.html', {'admin': admin})
        
        try:
            category = Category.objects.create(
                name=name,
                slug=slug,
                description=description,
            )
            
            # Log the action
            AdminAuditLog.objects.create(
                admin=admin,
                action='CREATE_CATEGORY',
                description=f'Created category: {name}',
                ip_address=get_client_ip(request),
            )
            
            messages.success(request, f'Category "{name}" created successfully!')
            return redirect('gallery:admin_portal_manage_categories')
        except Exception as e:
            messages.error(request, f'Error creating category: {str(e)}')
    
    return render(request, 'gallery/admin_portal_create_category.html', {'admin': admin})


def admin_portal_delete_category(request, category_id):
    """
    Delete a category
    """
    admin = check_admin_session(request)
    
    if not admin:
        return redirect('gallery:admin_portal_login')
    
    if not admin.can_manage_categories:
        messages.error(request, 'You do not have permission to delete categories.')
        return redirect('gallery:admin_portal_dashboard')
    
    try:
        category = Category.objects.get(id=category_id)
        name = category.name
        category.delete()
        
        # Log the action
        AdminAuditLog.objects.create(
            admin=admin,
            action='DELETE_CATEGORY',
            description=f'Deleted category: {name}',
            ip_address=get_client_ip(request),
        )
        
        messages.success(request, f'Category "{name}" deleted successfully!')
    except Category.DoesNotExist:
        messages.error(request, 'Category not found.')
    
    return redirect('gallery:admin_portal_manage_categories')
