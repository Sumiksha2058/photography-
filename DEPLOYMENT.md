# Soul Lens Photography - Deployment Guide

Complete guide for deploying the Django photography portfolio to production.

## 🌐 Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Procfile**
```
web: gunicorn photography_project.wsgi --log-file -
release: python manage.py migrate
```

2. **Create runtime.txt**
```
python-3.11.0
```

3. **Create .env.production**
```
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-app-name.herokuapp.com
DATABASE_URL=mysql://user:password@host:port/dbname
```

4. **Deploy**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Option 2: AWS EC2 Deployment

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 22.04)
- SSH access to instance

#### Steps

1. **Connect to EC2 Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. **Install System Dependencies**
```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv mysql-server nginx git
```

3. **Clone Repository**
```bash
git clone https://github.com/Sumiksha2058/photography-.git
cd photography-
```

4. **Setup Virtual Environment**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Configure MySQL**
```bash
sudo mysql_secure_installation
sudo mysql -u root -p
```

```sql
CREATE DATABASE photography_db CHARACTER SET utf8mb4;
CREATE USER 'photo_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON photography_db.* TO 'photo_user'@'localhost';
FLUSH PRIVILEGES;
```

6. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

7. **Run Migrations**
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

8. **Configure Gunicorn**
```bash
# Create gunicorn service file
sudo nano /etc/systemd/system/gunicorn.service
```

```ini
[Unit]
Description=Gunicorn application server for Soul Lens Photography
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/photography-
ExecStart=/home/ubuntu/photography-/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:8000 \
    photography_project.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

9. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/photography
```

```nginx
upstream gunicorn {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 100M;

    location /static/ {
        alias /home/ubuntu/photography-/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /home/ubuntu/photography-/media/;
        expires 7d;
    }

    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

10. **Enable Nginx Site**
```bash
sudo ln -s /etc/nginx/sites-available/photography /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Start Gunicorn Service**
```bash
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

12. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 3: DigitalOcean App Platform

#### Steps

1. **Create app.yaml**
```yaml
name: soul-lens-photography
services:
- name: web
  github:
    repo: Sumiksha2058/photography-
    branch: main
  build_command: pip install -r requirements.txt && python manage.py collectstatic --noinput
  run_command: gunicorn photography_project.wsgi:application --bind 0.0.0.0:8080
  envs:
  - key: DEBUG
    value: "False"
  - key: SECRET_KEY
    scope: RUN_AND_BUILD_TIME
    value: ${SECRET_KEY}
  http_port: 8080

databases:
- name: db
  engine: MYSQL
  version: "8"
```

2. **Deploy via DigitalOcean CLI**
```bash
doctl apps create --spec app.yaml
```

### Option 4: Docker Deployment

#### Create Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "photography_project.wsgi:application"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - DB_NAME=photography_db
      - DB_USER=photo_user
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
    depends_on:
      - db
    volumes:
      - ./media:/app/media
      - ./staticfiles:/app/staticfiles

  db:
    image: mysql:8
    environment:
      - MYSQL_DATABASE=photography_db
      - MYSQL_USER=photo_user
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

#### Deploy
```bash
docker-compose up -d
docker-compose exec web python manage.py migrate
```

## 🔒 Production Security Checklist

- [ ] Set `DEBUG = False` in settings.py
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Enable HTTPS/SSL
- [ ] Set `SECURE_SSL_REDIRECT = True`
- [ ] Set `SESSION_COOKIE_SECURE = True`
- [ ] Set `CSRF_COOKIE_SECURE = True`
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Setup monitoring and logging
- [ ] Configure firewall rules
- [ ] Use strong database passwords
- [ ] Keep dependencies updated
- [ ] Setup automated backups

## 📊 Monitoring & Maintenance

### Setup Logging
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### Database Backups
```bash
# Daily backup script
#!/bin/bash
mysqldump -u photo_user -p$DB_PASSWORD photography_db > /backups/photography_$(date +%Y%m%d).sql
```

### Monitor Performance
```bash
# Check server resources
top
df -h
free -h

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check Gunicorn logs
journalctl -u gunicorn -f
```

## 🚀 Continuous Deployment

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd photography-
            git pull origin main
            source venv/bin/activate
            pip install -r requirements.txt
            python manage.py migrate
            python manage.py collectstatic --noinput
            sudo systemctl restart gunicorn
```

## 📞 Support

For deployment issues, refer to:
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- Let's Encrypt: https://letsencrypt.org/

---

**Last Updated:** March 2026
**Version:** 1.0.0
