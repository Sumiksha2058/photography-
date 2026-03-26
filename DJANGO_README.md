# Photography Portfolio - Django Edition

This is a complete Django-based photography portfolio application with MySQL database support. The project includes a full-featured admin dashboard, RESTful API endpoints, and responsive design.

## Project Structure

```
photography-/
├── photography_project/          # Main Django project settings
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # Main URL routing
│   ├── wsgi.py                  # WSGI application
│   └── asgi.py                  # ASGI application
├── gallery/                     # Gallery app (photos & categories)
│   ├── models.py                # Photo and Category models
│   ├── views.py                 # API views/endpoints
│   ├── urls.py                  # Gallery URL routing
│   ├── admin.py                 # Django admin configuration
│   └── migrations/              # Database migrations
├── accounts/                    # User accounts app (for future expansion)
├── manage.py                    # Django management script
├── requirements.txt             # Python dependencies
└── media/                       # Uploaded media files (auto-created)
```

## Features

### Database Models

**Category Model**
- `name`: Category name (unique)
- `slug`: URL-friendly identifier
- `description`: Category description
- `created_at`, `updated_at`: Timestamps

**Photo Model**
- `title`: Photo title
- `description`: Photo description
- `category`: Foreign key to Category
- `image`: Image file upload
- `image_url`: External image URL option
- `uploaded_by`: Foreign key to User
- `is_featured`: Boolean flag for featured photos
- `views`: View counter
- `created_at`, `updated_at`: Timestamps

### API Endpoints

#### Photos
- `GET /api/photos/` - Get all photos with pagination and filtering
  - Query params: `category`, `page`, `per_page`, `featured`
- `GET /api/photos/<id>/` - Get single photo details
- `POST /api/photos/create/` - Create new photo (admin only)
- `PUT /api/photos/<id>/update/` - Update photo (admin only)
- `DELETE /api/photos/<id>/delete/` - Delete photo (admin only)

#### Categories
- `GET /api/categories/` - Get all categories
- `POST /api/categories/create/` - Create new category (admin only)
- `PUT /api/categories/<id>/update/` - Update category (admin only)
- `DELETE /api/categories/<id>/delete/` - Delete category (admin only)

### Admin Dashboard
- Full Django admin interface at `/admin/`
- Photo management with filtering and search
- Category management
- User and permission management

## Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Database

Edit `photography_project/settings.py` and update the DATABASES configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'photography_db',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 3. Create MySQL Database
```bash
mysql -u root -p
CREATE DATABASE photography_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
```

### 6. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 7. Run Development Server
```bash
python manage.py runserver
```

The application will be available at `http://localhost:8000/`

## Usage

### Admin Interface
Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials.

### API Usage Examples

**Get all photos:**
```bash
curl http://localhost:8000/api/photos/
```

**Get featured photos:**
```bash
curl http://localhost:8000/api/photos/?featured=true
```

**Get photos by category:**
```bash
curl http://localhost:8000/api/photos/?category=1
```

**Get single photo:**
```bash
curl http://localhost:8000/api/photos/1/
```

**Create a photo (requires authentication):**
```bash
curl -X POST http://localhost:8000/api/photos/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Photo",
    "description": "Photo description",
    "category_id": 1,
    "image_url": "https://example.com/photo.jpg",
    "is_featured": true
  }'
```

## Configuration

### CORS Settings
The application is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:8000`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8000`

Modify `CORS_ALLOWED_ORIGINS` in `settings.py` for production.

### Media Files
- Uploaded images are stored in the `media/photos/` directory
- Configure `MEDIA_ROOT` and `MEDIA_URL` in settings.py

## Deployment

### Using Gunicorn
```bash
gunicorn photography_project.wsgi:application --bind 0.0.0.0:8000
```

### Production Checklist
1. Set `DEBUG = False` in settings.py
2. Update `SECRET_KEY` with a secure value
3. Configure `ALLOWED_HOSTS` with your domain
4. Use environment variables for sensitive data
5. Set up proper database backups
6. Configure static file serving (nginx/Apache)
7. Enable HTTPS/SSL
8. Set up logging and monitoring

## Development

### Create Migrations
```bash
python manage.py makemigrations
```

### Apply Migrations
```bash
python manage.py migrate
```

### Run Tests
```bash
python manage.py test
```

### Shell Access
```bash
python manage.py shell
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in settings.py
- Check database exists: `SHOW DATABASES;`

### Migration Errors
- Clear migrations: `python manage.py migrate gallery zero`
- Recreate migrations: `python manage.py makemigrations`

### Permission Errors
- Ensure user is staff: `user.is_staff = True`
- Check user permissions in admin panel

## Future Enhancements

- [ ] Frontend UI (React/Vue/Django templates)
- [ ] Image optimization and thumbnails
- [ ] Advanced search and filtering
- [ ] User comments and ratings
- [ ] Social media integration
- [ ] Email notifications
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting and caching
- [ ] Image watermarking
- [ ] Export functionality

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.
