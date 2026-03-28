from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import uuid


class AdminUser(models.Model):
    """
    Separate admin authentication model for portal access.
    This is independent from Django's built-in User model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_superadmin = models.BooleanField(default=False)
    
    # Permissions
    can_manage_photos = models.BooleanField(default=True)
    can_manage_categories = models.BooleanField(default=True)
    can_view_analytics = models.BooleanField(default=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'admin_users'
        verbose_name = 'Admin User'
        verbose_name_plural = 'Admin Users'
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    def set_password(self, raw_password):
        """Hash and set the password"""
        self.password_hash = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Check if the provided password matches the hash"""
        return check_password(raw_password, self.password_hash)
    
    def has_permission(self, permission):
        """Check if admin has specific permission"""
        if self.is_superadmin:
            return True
        
        permission_map = {
            'manage_photos': self.can_manage_photos,
            'manage_categories': self.can_manage_categories,
            'view_analytics': self.can_view_analytics,
        }
        return permission_map.get(permission, False)


class AdminSession(models.Model):
    """
    Track admin login sessions for security
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(AdminUser, on_delete=models.CASCADE, related_name='sessions')
    session_token = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'admin_sessions'
        verbose_name = 'Admin Session'
        verbose_name_plural = 'Admin Sessions'
    
    def __str__(self):
        return f"Session for {self.admin.username}"


class AdminAuditLog(models.Model):
    """
    Log all admin actions for security and accountability
    """
    ACTION_CHOICES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('UPLOAD_PHOTO', 'Upload Photo'),
        ('DELETE_PHOTO', 'Delete Photo'),
        ('EDIT_PHOTO', 'Edit Photo'),
        ('CREATE_CATEGORY', 'Create Category'),
        ('DELETE_CATEGORY', 'Delete Category'),
        ('EDIT_CATEGORY', 'Edit Category'),
        ('MANAGE_ADMIN', 'Manage Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(AdminUser, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'admin_audit_logs'
        verbose_name = 'Admin Audit Log'
        verbose_name_plural = 'Admin Audit Logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.admin.username} - {self.action}"
