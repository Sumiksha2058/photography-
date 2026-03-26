from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Photo, Category


def admin_login(request):
    """Admin login page"""
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('gallery:admin_dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_staff:
            login(request, user)
            messages.success(request, f'Welcome back, {user.username}!')
            return redirect('gallery:admin_dashboard')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    
    return render(request, 'gallery/admin_login.html')


@login_required(login_url='gallery:admin_login')
def admin_dashboard(request):
    """Admin dashboard"""
    if not request.user.is_staff:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('gallery:home')
    
    photos = Photo.objects.all().order_by('-created_at')
    recent_photos = photos[:10]
    categories = Category.objects.all()
    
    total_photos = photos.count()
    total_categories = categories.count()
    total_views = sum(photo.views for photo in photos)
    
    context = {
        'recent_photos': recent_photos,
        'total_photos': total_photos,
        'total_categories': total_categories,
        'total_views': total_views,
    }
    return render(request, 'gallery/admin_dashboard.html', context)


@login_required(login_url='gallery:admin_login')
def admin_logout(request):
    """Admin logout"""
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('gallery:home')


@login_required(login_url='gallery:admin_login')
def upload_photo_form(request):
    """Display upload photo form"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        category_id = request.POST.get('category')
        is_featured = request.POST.get('is_featured') == 'on'
        image = request.FILES.get('image')
        
        try:
            photo = Photo.objects.create(
                title=title,
                description=description,
                category_id=category_id if category_id else None,
                image=image,
                uploaded_by=request.user,
                is_featured=is_featured,
            )
            messages.success(request, f'Photo "{title}" uploaded successfully!')
            return redirect('gallery:admin_dashboard')
        except Exception as e:
            messages.error(request, f'Error uploading photo: {str(e)}')
    
    categories = Category.objects.all()
    context = {'categories': categories}
    return render(request, 'gallery/upload_photo_form.html', context)


@login_required(login_url='gallery:admin_login')
def create_category_form(request):
    """Display create category form"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        description = request.POST.get('description')
        
        try:
            category = Category.objects.create(
                name=name,
                slug=slug,
                description=description,
            )
            messages.success(request, f'Category "{name}" created successfully!')
            return redirect('gallery:admin_dashboard')
        except Exception as e:
            messages.error(request, f'Error creating category: {str(e)}')
    
    return render(request, 'gallery/create_category_form.html')


@login_required(login_url='gallery:admin_login')
def manage_photos(request):
    """Manage all photos"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    photos = Photo.objects.all().order_by('-created_at')
    context = {'photos': photos}
    return render(request, 'gallery/manage_photos.html', context)


@login_required(login_url='gallery:admin_login')
def manage_categories(request):
    """Manage all categories"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    categories = Category.objects.all().order_by('name')
    
    # Add photo count to each category
    for category in categories:
        category.photo_count = category.photo_set.count()
    
    context = {'categories': categories}
    return render(request, 'gallery/manage_categories.html', context)


@login_required(login_url='gallery:admin_login')
def edit_photo(request, photo_id):
    """Edit a photo"""
    photo = get_object_or_404(Photo, id=photo_id)
    
    if not request.user.is_staff and photo.uploaded_by != request.user:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    if request.method == 'POST':
        try:
            photo.title = request.POST.get('title', photo.title)
            photo.description = request.POST.get('description', photo.description)
            category_id = request.POST.get('category')
            if category_id:
                photo.category_id = category_id
            photo.is_featured = request.POST.get('is_featured') == 'on'
            photo.save()
            messages.success(request, 'Photo updated successfully!')
            return redirect('gallery:manage_photos')
        except Exception as e:
            messages.error(request, f'Error updating photo: {str(e)}')
    
    categories = Category.objects.all()
    context = {'photo': photo, 'categories': categories}
    return render(request, 'gallery/edit_photo.html', context)


@login_required(login_url='gallery:admin_login')
def delete_photo(request, photo_id):
    """Delete a photo"""
    photo = get_object_or_404(Photo, id=photo_id)
    
    if not request.user.is_staff and photo.uploaded_by != request.user:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    if request.method == 'POST' or request.GET.get('confirm') == 'yes':
        title = photo.title
        photo.delete()
        messages.success(request, f'Photo "{title}" deleted successfully!')
        return redirect('gallery:manage_photos')
    
    context = {'photo': photo}
    return render(request, 'gallery/confirm_delete.html', context)


@login_required(login_url='gallery:admin_login')
def edit_category(request, category_id):
    """Edit a category"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    category = get_object_or_404(Category, id=category_id)
    
    if request.method == 'POST':
        try:
            category.name = request.POST.get('name', category.name)
            category.slug = request.POST.get('slug', category.slug)
            category.description = request.POST.get('description', category.description)
            category.save()
            messages.success(request, 'Category updated successfully!')
            return redirect('gallery:manage_categories')
        except Exception as e:
            messages.error(request, f'Error updating category: {str(e)}')
    
    context = {'category': category}
    return render(request, 'gallery/edit_category.html', context)


@login_required(login_url='gallery:admin_login')
def delete_category(request, category_id):
    """Delete a category"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    category = get_object_or_404(Category, id=category_id)
    
    if request.method == 'POST' or request.GET.get('confirm') == 'yes':
        name = category.name
        category.delete()
        messages.success(request, f'Category "{name}" deleted successfully!')
        return redirect('gallery:manage_categories')
    
    context = {'category': category}
    return render(request, 'gallery/confirm_delete_category.html', context)
