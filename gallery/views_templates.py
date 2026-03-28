from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.views.decorators.http import require_http_methods
from .models import Photo, Category


def home(request):
    """Home page view - Modern design"""
    featured_photos = Photo.objects.filter(is_featured=True)[:6]
    context = {
        'featured_photos': featured_photos,
    }
    return render(request, 'gallery/home_modern.html', context)


def gallery(request):
    """Gallery page with filtering and pagination"""
    category_id = request.GET.get('category')
    page = request.GET.get('page', 1)
    
    queryset = Photo.objects.select_related('category', 'uploaded_by')
    
    if category_id:
        queryset = queryset.filter(category_id=category_id)
    
    paginator = Paginator(queryset, 12)
    page_obj = paginator.get_page(page)
    
    categories = Category.objects.all()
    
    context = {
        'photos': page_obj,
        'page_obj': page_obj,
        'is_paginated': page_obj.has_other_pages(),
        'categories': categories,
        'selected_category': int(category_id) if category_id else None,
    }
    return render(request, 'gallery/gallery.html', context)


@login_required
def admin_panel(request):
    """Admin panel view"""
    if not request.user.is_staff:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('gallery:home')
    
    photos = Photo.objects.all()
    categories = Category.objects.all()
    
    total_photos = photos.count()
    total_categories = categories.count()
    total_views = sum(photo.views for photo in photos)
    
    context = {
        'photos': photos,
        'categories': categories,
        'total_photos': total_photos,
        'total_categories': total_categories,
        'total_views': total_views,
    }
    return render(request, 'gallery/admin_panel.html', context)


@login_required
@require_http_methods(["POST"])
def upload_photo(request):
    """Upload a new photo"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    try:
        title = request.POST.get('title')
        description = request.POST.get('description')
        category_id = request.POST.get('category')
        is_featured = request.POST.get('is_featured') == 'on'
        image = request.FILES.get('image')
        
        photo = Photo.objects.create(
            title=title,
            description=description,
            category_id=category_id if category_id else None,
            image=image,
            uploaded_by=request.user,
            is_featured=is_featured,
        )
        messages.success(request, f'Photo "{title}" uploaded successfully!')
    except Exception as e:
        messages.error(request, f'Error uploading photo: {str(e)}')
    
    return redirect('gallery:admin_panel')


@login_required
@require_http_methods(["POST"])
def create_category(request):
    """Create a new category"""
    if not request.user.is_staff:
        messages.error(request, 'Permission denied.')
        return redirect('gallery:home')
    
    try:
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        description = request.POST.get('description')
        
        category = Category.objects.create(
            name=name,
            slug=slug,
            description=description,
        )
        messages.success(request, f'Category "{name}" created successfully!')
    except Exception as e:
        messages.error(request, f'Error creating category: {str(e)}')
    
    return redirect('gallery:admin_panel')


@login_required
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
            return redirect('gallery:admin_panel')
        except Exception as e:
            messages.error(request, f'Error updating photo: {str(e)}')
    
    categories = Category.objects.all()
    context = {
        'photo': photo,
        'categories': categories,
    }
    return render(request, 'gallery/edit_photo.html', context)


@login_required
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
        return redirect('gallery:admin_panel')
    
    context = {'photo': photo}
    return render(request, 'gallery/confirm_delete.html', context)


@login_required
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
            return redirect('gallery:admin_panel')
        except Exception as e:
            messages.error(request, f'Error updating category: {str(e)}')
    
    context = {'category': category}
    return render(request, 'gallery/edit_category.html', context)


@login_required
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
        return redirect('gallery:admin_panel')
    
    context = {'category': category}
    return render(request, 'gallery/confirm_delete_category.html', context)
