from django.shortcuts import render
from django.http import JsonResponse
from .models import Photo, Category

def home_redesigned(request):
    """
    Redesigned home page with professional layout matching Chhaya Photography style
    """
    # Get featured photos (limit to 6 for the grid)
    featured_photos = Photo.objects.filter(is_featured=True)[:6]
    
    # If not enough featured photos, get recent photos
    if featured_photos.count() < 6:
        all_photos = Photo.objects.all().order_by('-created_at')[:6]
        featured_photos = all_photos
    
    # Get all categories
    categories = Category.objects.all()
    
    # Get statistics
    total_photos = Photo.objects.count()
    total_categories = Category.objects.count()
    total_views = Photo.objects.aggregate(total_views=models.Sum('views'))['total_views'] or 0
    
    context = {
        'featured_photos': featured_photos,
        'categories': categories,
        'total_photos': total_photos,
        'total_categories': total_categories,
        'total_views': total_views,
    }
    
    return render(request, 'gallery/home_redesigned.html', context)


def gallery_redesigned(request):
    """
    Redesigned gallery page with filtering and pagination
    """
    # Get all photos
    photos = Photo.objects.all().order_by('-created_at')
    
    # Get all categories
    categories = Category.objects.all()
    
    # Filter by category if provided
    category_id = request.GET.get('category')
    if category_id:
        photos = photos.filter(category_id=category_id)
    
    # Pagination
    from django.core.paginator import Paginator
    paginator = Paginator(photos, 12)  # 12 photos per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'photos': page_obj.object_list,
        'categories': categories,
        'selected_category': category_id,
    }
    
    return render(request, 'gallery/gallery_redesigned.html', context)


def portfolio_detail(request, photo_id):
    """
    Detailed view of a single photo
    """
    try:
        photo = Photo.objects.get(id=photo_id)
        # Increment view count
        photo.views += 1
        photo.save()
        
        # Get related photos from same category
        related_photos = Photo.objects.filter(
            category=photo.category
        ).exclude(id=photo_id)[:4]
        
        context = {
            'photo': photo,
            'related_photos': related_photos,
        }
        
        return render(request, 'gallery/portfolio_detail.html', context)
    except Photo.DoesNotExist:
        return render(request, 'gallery/404.html', status=404)


def about(request):
    """
    About page with team information
    """
    context = {
        'page_title': 'About Soul Lens Photography',
    }
    return render(request, 'gallery/about.html', context)


def services(request):
    """
    Services page
    """
    services_list = [
        {
            'title': 'Wedding Photography',
            'description': 'Capturing the essence of your special day with artistic vision and technical excellence.',
            'icon': 'fa-camera',
        },
        {
            'title': 'Cinematic Videography',
            'description': 'Professional 4K video production with drone footage and same-day edits.',
            'icon': 'fa-video',
        },
        {
            'title': 'Portrait Sessions',
            'description': 'Beautiful individual and family portraits that capture your personality.',
            'icon': 'fa-portrait',
        },
        {
            'title': 'Event Photography',
            'description': 'Professional coverage of corporate events, celebrations, and special occasions.',
            'icon': 'fa-calendar',
        },
    ]
    
    context = {
        'services': services_list,
        'page_title': 'Our Services',
    }
    return render(request, 'gallery/services.html', context)


def contact(request):
    """
    Contact page with form
    """
    if request.method == 'POST':
        # Handle contact form submission
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')
        
        # TODO: Save contact message to database or send email
        
        return JsonResponse({
            'status': 'success',
            'message': 'Thank you for your message. We will get back to you soon!'
        })
    
    context = {
        'page_title': 'Contact Us',
    }
    return render(request, 'gallery/contact.html', context)
