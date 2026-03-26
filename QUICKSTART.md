# Soul Lens Photography - Quick Start Guide

Get the Django photography portfolio running in 5 minutes!

## ⚡ Quick Setup (Linux/Mac)

### 1. Clone & Setup
```bash
git clone https://github.com/Sumiksha2058/photography-.git
cd photography-
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Create database
mysql -u root -p
```

```sql
CREATE DATABASE photography_db CHARACTER SET utf8mb4;
CREATE USER 'photo_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON photography_db.* TO 'photo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configure & Migrate
```bash
# Update settings.py with your database credentials
python manage.py migrate
python manage.py collectstatic --noinput
```

### 4. Create Admin User
```bash
python manage.py shell
```

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
exit()
```

### 5. Run Server
```bash
python manage.py runserver 0.0.0.0:8000
```

## 🌐 Access Points

| Page | URL | Purpose |
|------|-----|---------|
| **Gallery** | http://localhost:8000/ | Public photo gallery |
| **Admin Portal** | http://localhost:8000/admin-portal/login/ | Admin management |
| **Django Admin** | http://localhost:8000/admin/ | Django administration |
| **API** | http://localhost:8000/api/photos/ | REST API |

## 🔐 Default Credentials

**Admin Portal:**
- Username: `admin`
- Password: `admin123`

## 📦 Dependencies

All dependencies are listed in `requirements.txt`:

```
Django==5.2.12
djangorestframework==3.14.0
django-cors-headers==4.9.0
mysqlclient==2.2.8
Pillow==10.1.0
gunicorn==21.2.0
... and more
```

Install all with:
```bash
pip install -r requirements.txt
```

## 🚀 Key Features

✅ **Separate Admin Authentication** - Independent admin portal with session management  
✅ **Photo Management** - Upload, organize, and manage photos  
✅ **Category System** - Organize photos by categories  
✅ **RESTful API** - Full API for photo and category operations  
✅ **Audit Logging** - Track all admin actions  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **MySQL Database** - Reliable data storage  

## 📁 Project Structure

```
photography-/
├── gallery/                 # Main app
│   ├── models.py           # Database models
│   ├── views.py            # API views
│   ├── admin_auth_views.py # Admin portal
│   └── templates/          # HTML templates
├── photography_project/     # Django config
├── manage.py               # Django CLI
├── requirements.txt        # Dependencies
└── README.md              # Documentation
```

## 🔧 Common Commands

```bash
# Run migrations
python manage.py migrate

# Create superuser for Django admin
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Run development server
python manage.py runserver

# Access Django shell
python manage.py shell

# Create migrations
python manage.py makemigrations
```

## 🐛 Troubleshooting

**MySQL Connection Error?**
- Check MySQL is running: `sudo service mysql status`
- Verify credentials in `settings.py`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Port 8000 Already in Use?**
```bash
lsof -i :8000
kill -9 <PID>
```

**Static Files Not Loading?**
```bash
python manage.py collectstatic --noinput
```

## 📚 Full Documentation

- **Installation:** See `INSTALLATION.md`
- **Deployment:** See `DEPLOYMENT.md`
- **API Reference:** See `DJANGO_README.md`
- **Transformation Details:** See `TRANSFORMATION_SUMMARY.md`

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Run migrations
4. ✅ Create admin user
5. ✅ Start server
6. 📸 Upload photos via admin portal
7. 📁 Create categories
8. 🚀 Deploy to production

## 💡 Tips

- Use virtual environment to avoid conflicts
- Keep `.env` file secure and never commit it
- Regularly backup your database
- Monitor server logs for errors
- Keep dependencies updated

## 🤝 Contributing

Found a bug? Have a feature request?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the documentation files
- Review Django documentation: https://docs.djangoproject.com/
- Check Django REST Framework: https://www.django-rest-framework.org/

---

**Ready to go!** 🚀

Start with: `python manage.py runserver 0.0.0.0:8000`

Then visit: http://localhost:8000/
