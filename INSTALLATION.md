# Soul Lens Photography - Installation & Setup Guide

Complete guide to install and run the Django photography portfolio application.

## 📋 System Requirements

- **Python:** 3.8 or higher
- **MySQL:** 5.7 or higher
- **Node.js:** 14.0 or higher (optional, for frontend tooling)
- **Git:** For version control
- **Virtual Environment:** Recommended (venv or virtualenv)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Sumiksha2058/photography-.git
cd photography-
```

### 2. Create Virtual Environment

**On Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Create MySQL Database

**Using MySQL Command Line:**
```bash
mysql -u root -p
```

Then execute:
```sql
CREATE DATABASE photography_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'photography_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON photography_db.* TO 'photography_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=photography_db
DB_USER=photography_user
DB_PASSWORD=secure_password_here
DB_HOST=localhost
DB_PORT=3306

# Email Configuration (Optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security (Production)
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

### 6. Update Django Settings

Edit `photography_project/settings.py`:

```python
import os
from decouple import config

# Database
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.mysql'),
        'NAME': config('DB_NAME', default='photography_db'),
        'USER': config('DB_USER', default='root'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
    }
}

# Security
DEBUG = config('DEBUG', default=True, cast=bool)
SECRET_KEY = config('SECRET_KEY', default='your-secret-key')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')
```

### 7. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Create Admin User

```bash
python manage.py shell
```

Then in the Python shell:

```python
from gallery.admin_auth_models import AdminUser

admin = AdminUser.objects.create(
    username='admin',
    email='admin@soullensphotography.com',
    full_name='Soul Lens Admin',
    is_active=True,
    is_superadmin=True,
    can_manage_photos=True,
    can_manage_categories=True,
    can_view_analytics=True,
)
admin.set_password('admin123')
admin.save()

print(f"Admin user created: {admin.username}")
exit()
```

### 9. Create Superuser (for Django Admin)

```bash
python manage.py createsuperuser
```

### 10. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 11. Run Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Visit: `http://localhost:8000/`

## 🔐 Admin Portal Access

- **URL:** `http://localhost:8000/admin-portal/login/`
- **Username:** `admin`
- **Password:** `admin123`

## 📊 Django Admin Access

- **URL:** `http://localhost:8000/admin/`
- **Username:** (from superuser creation)
- **Password:** (from superuser creation)

## 📁 Project Structure

```
photography-/
├── photography_project/      # Main Django project
│   ├── settings.py          # Project settings
│   ├── urls.py              # URL routing
│   ├── wsgi.py              # WSGI configuration
│   └── asgi.py              # ASGI configuration
├── gallery/                 # Gallery app
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── admin_auth_views.py  # Admin portal views
│   ├── urls.py              # API URLs
│   ├── urls_admin_portal.py # Admin portal URLs
│   ├── templates/           # HTML templates
│   └── migrations/          # Database migrations
├── accounts/                # User accounts app
├── media/                   # User uploaded files
├── staticfiles/             # Collected static files
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
└── README.md               # Project documentation
```

## 🔧 Configuration Files

### settings.py
Main Django configuration file. Update database credentials, allowed hosts, and security settings here.

### .env
Environment variables for sensitive data. Never commit to version control.

### requirements.txt
All Python package dependencies. Install with: `pip install -r requirements.txt`

## 🚀 Production Deployment

### Using Gunicorn

```bash
gunicorn photography_project.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Using Nginx (Reverse Proxy)

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

### Environment Variables for Production

```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: (2002, "Can't connect to MySQL server on 'localhost'")
```
**Solution:** Ensure MySQL is running and credentials are correct in `.env`

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput
```

### Migration Errors
```bash
python manage.py migrate --fake-initial
```

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

## 📚 API Endpoints

### Photos
- `GET /api/photos/` - List all photos
- `POST /api/photos/` - Create photo
- `GET /api/photos/{id}/` - Get photo details
- `PUT /api/photos/{id}/` - Update photo
- `DELETE /api/photos/{id}/` - Delete photo

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong passwords** - For database and admin accounts
3. **Enable HTTPS** - In production
4. **Regular backups** - Of database and media files
5. **Keep dependencies updated** - Run `pip install --upgrade -r requirements.txt`
6. **Use environment variables** - For sensitive data
7. **Enable CORS carefully** - Only allow trusted origins
8. **Monitor logs** - Check for suspicious activity

## 📞 Support & Documentation

- **Django Documentation:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **MySQL Documentation:** https://dev.mysql.com/doc/

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Last Updated:** March 2026
**Version:** 1.0.0
