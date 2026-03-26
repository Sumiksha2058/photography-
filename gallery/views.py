from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json
from .models import Photo, Category


def get_photos(request):
    """Get all photos with optional filtering and pagination"""
    category_id = request.GET.get('category')
    page = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', 12)
    featured_only = request.GET.get('featured', 'false').lower() == 'true'

    queryset = Photo.objects.select_related('category', 'uploaded_by')

    if featured_only:
        queryset = queryset.filter(is_featured=True)
    if category_id:
        queryset = queryset.filter(category_id=category_id)

    paginator = Paginator(queryset, int(per_page))
    page_obj = paginator.get_page(page)

    photos = [{
        'id': photo.id,
        'title': photo.title,
        'description': photo.description,
        'image_url': photo.image.url if photo.image else photo.image_url,
        'category': {'id': photo.category.id, 'name': photo.category.name} if photo.category else None,
        'uploaded_by': photo.uploaded_by.username,
        'is_featured': photo.is_featured,
        'views': photo.views,
        'created_at': photo.created_at.isoformat(),
    } for photo in page_obj]

    return JsonResponse({
        'photos': photos,
        'total': paginator.count,
        'page': page,
        'pages': paginator.num_pages,
    })


def get_photo_detail(request, photo_id):
    """Get a single photo by ID"""
    photo = get_object_or_404(Photo, id=photo_id)
    photo.increment_views()

    return JsonResponse({
        'id': photo.id,
        'title': photo.title,
        'description': photo.description,
        'image_url': photo.image.url if photo.image else photo.image_url,
        'category': {'id': photo.category.id, 'name': photo.category.name} if photo.category else None,
        'uploaded_by': photo.uploaded_by.username,
        'is_featured': photo.is_featured,
        'views': photo.views,
        'created_at': photo.created_at.isoformat(),
        'updated_at': photo.updated_at.isoformat(),
    })


def get_categories(request):
    """Get all categories"""
    categories = Category.objects.all()
    return JsonResponse({
        'categories': [{
            'id': cat.id,
            'name': cat.name,
            'slug': cat.slug,
            'description': cat.description,
            'photo_count': cat.photos.count(),
        } for cat in categories]
    })


@login_required
@require_http_methods(["POST"])
@csrf_exempt
def create_photo(request):
    """Create a new photo (admin only)"""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    try:
        data = json.loads(request.body)
        photo = Photo.objects.create(
            title=data.get('title'),
            description=data.get('description'),
            category_id=data.get('category_id'),
            image_url=data.get('image_url'),
            uploaded_by=request.user,
            is_featured=data.get('is_featured', False),
        )
        return JsonResponse({
            'id': photo.id,
            'title': photo.title,
            'message': 'Photo created successfully'
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@require_http_methods(["PUT"])
@csrf_exempt
def update_photo(request, photo_id):
    """Update a photo (admin only)"""
    photo = get_object_or_404(Photo, id=photo_id)
    if not request.user.is_staff and photo.uploaded_by != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    try:
        data = json.loads(request.body)
        photo.title = data.get('title', photo.title)
        photo.description = data.get('description', photo.description)
        photo.is_featured = data.get('is_featured', photo.is_featured)
        if 'category_id' in data:
            photo.category_id = data.get('category_id')
        photo.save()
        return JsonResponse({'message': 'Photo updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@require_http_methods(["DELETE"])
@csrf_exempt
def delete_photo(request, photo_id):
    """Delete a photo (admin only)"""
    photo = get_object_or_404(Photo, id=photo_id)
    if not request.user.is_staff and photo.uploaded_by != request.user:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    photo.delete()
    return JsonResponse({'message': 'Photo deleted successfully'})


@login_required
@require_http_methods(["POST"])
@csrf_exempt
def create_category(request):
    """Create a new category (admin only)"""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    try:
        data = json.loads(request.body)
        category = Category.objects.create(
            name=data.get('name'),
            slug=data.get('slug'),
            description=data.get('description'),
        )
        return JsonResponse({
            'id': category.id,
            'name': category.name,
            'message': 'Category created successfully'
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@require_http_methods(["PUT"])
@csrf_exempt
def update_category(request, category_id):
    """Update a category (admin only)"""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    category = get_object_or_404(Category, id=category_id)
    try:
        data = json.loads(request.body)
        category.name = data.get('name', category.name)
        category.slug = data.get('slug', category.slug)
        category.description = data.get('description', category.description)
        category.save()
        return JsonResponse({'message': 'Category updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
@require_http_methods(["DELETE"])
@csrf_exempt
def delete_category(request, category_id):
    """Delete a category (admin only)"""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    category = get_object_or_404(Category, id=category_id)
    category.delete()
    return JsonResponse({'message': 'Category deleted successfully'})
