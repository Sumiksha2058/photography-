# Django Photography Portfolio - Complete Setup Guide

This guide will help you set up and run the Django photography portfolio application.

## Prerequisites

- Python 3.8+
- MySQL 5.7+ or MariaDB
- pip (Python package manager)
- Virtual environment (recommended)

## Step 1: Install Dependencies

### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
```

### Install Python packages:
```bash
pip install -r requirements.txt
```

## Step 2: Configure Database

### Create MySQL Database:
```bash
mysql -u root -p
```

```sql
CREATE DATABASE photography_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'photo_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON photography_db.* TO 'photo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Update Django Settings:
Edit `photography_project/settings.py` and update the DATABASES section:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'photography_db',
        'USER': 'photo_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## Step 3: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 4: Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## Step 5: Collect Static Files

```bash
python manage.py collectstatic --noinput
```

## Step 6: Run Development Server

```bash
python manage.py runserver
```

The application will be available at: `http://localhost:8000/`

## Accessing the Application

- **Home Page**: http://localhost:8000/
- **Gallery**: http://localhost:8000/gallery/
- **Admin Panel**: http://localhost:8000/admin/ (login with superuser credentials)
- **Django Admin**: http://localhost:8000/admin/

## API Endpoints

### Photos
- `GET /api/photos/` - List all photos
- `GET /api/photos/<id>/` - Get photo details
- `POST /api/photos/create/` - Create photo (admin only)
- `PUT /api/photos/<id>/update/` - Update photo (admin only)
- `DELETE /api/photos/<id>/delete/` - Delete photo (admin only)

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/create/` - Create category (admin only)
- `PUT /api/categories/<id>/update/` - Update category (admin only)
- `DELETE /api/categories/<id>/delete/` - Delete category (admin only)

## File Structure

```
photography-/
├── photography_project/          # Django project settings
│   ├── settings.py              # Configuration
│   ├── urls.py                  # URL routing
│   ├── wsgi.py                  # WSGI application
│   └── asgi.py                  # ASGI application
├── gallery/                     # Main app
│   ├── models.py                # Database models
│   ├── views.py                 # API views
│   ├── views_templates.py       # Template views
│   ├── urls.py                  # API URLs
│   ├── urls_templates.py        # Template URLs
│   ├── admin.py                 # Admin configuration
│   ├── templates/               # HTML templates
│   │   └── gallery/
│   │       ├── base.html
│   │       ├── home.html
│   │       ├── gallery.html
│   │       └── admin_panel.html
│   └── migrations/              # Database migrations
├── accounts/                    # User management app
├── manage.py                    # Django management
├── requirements.txt             # Dependencies
├── DJANGO_README.md             # Documentation
└── media/                       # Uploaded files

```

## Common Commands

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (careful!)
python manage.py migrate gallery zero
python manage.py migrate

# Access database shell
python manage.py dbshell
```

### Django Shell
```bash
python manage.py shell
```

### Create Test Data
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from gallery.models import Category, Photo

# Create a user
user = User.objects.create_user(username='testuser', password='testpass', is_staff=True)

# Create a category
category = Category.objects.create(name='Landscapes', slug='landscapes', description='Beautiful landscape photos')

# Create a photo
photo = Photo.objects.create(
    title='Mountain View',
    description='A beautiful mountain landscape',
    category=category,
    image_url='https://example.com/mountain.jpg',
    uploaded_by=user,
    is_featured=True
)
```

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn photography_project.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Using Nginx
Create `/etc/nginx/sites-available/photography`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /path/to/photography-/staticfiles/;
    }

    location /media/ {
        alias /path/to/photography-/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Production Settings
1. Set `DEBUG = False` in settings.py
2. Generate a new `SECRET_KEY`
3. Update `ALLOWED_HOSTS` with your domain
4. Configure SSL/HTTPS
5. Set up database backups
6. Configure logging

## Troubleshooting

### Database Connection Error
```
Error: (2003, "Can't connect to MySQL server on 'localhost' (111)")
```
**Solution**: Ensure MySQL is running and credentials are correct.

### Migration Errors
```bash
# Reset migrations
python manage.py migrate gallery zero
python manage.py makemigrations
python manage.py migrate
```

### Permission Denied on Media Upload
```bash
chmod -R 755 media/
```

### Static Files Not Loading
```bash
python manage.py collectstatic --clear --noinput
```

## Environment Variables

Create a `.env` file:
```
DEBUG=False
SECRET_KEY=your-secret-key
DB_NAME=photography_db
DB_USER=photo_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## Support & Documentation

- Django Documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- MySQL Documentation: https://dev.mysql.com/doc/

## License

MIT License - See LICENSE file for details
