from django.contrib import admin
from .models import Category, Photo

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_by', 'is_featured', 'views', 'created_at')
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('views', 'created_at', 'updated_at')
    fieldsets = (
        ('Photo Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Image', {
            'fields': ('image', 'image_url')
        }),
        ('Metadata', {
            'fields': ('uploaded_by', 'is_featured', 'views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
