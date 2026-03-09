# Photography Portfolio - TODO

## Database & Schema
- [x] Create Photo table with fields (id, title, description, category, imageUrl, uploadedBy, createdAt, updatedAt)
- [x] Create Category table with fields (id, name, slug, description)
- [x] Create relationships between Photo and Category tables
- [x] Run database migrations

## Frontend - Public Pages
- [x] Create homepage with hero section and featured photos
- [x] Create navigation menu with logo and links
- [x] Create portfolio gallery page with grid layout
- [x] Create category filter functionality
- [ ] Create photo detail/lightbox view
- [x] Create about page
- [x] Create contact page
- [x] Implement responsive design for mobile/tablet/desktop

## Admin Panel
- [x] Create admin dashboard layout
- [x] Create photo upload form with image preview
- [x] Create photo management table (list, edit, delete)
- [x] Create category management interface
- [x] Implement admin authentication/authorization
- [x] Create admin navigation menu

## API Endpoints
- [x] GET /api/photos - fetch all photos with pagination
- [x] GET /api/photos/:id - fetch single photo
- [x] GET /api/categories - fetch all categories
- [x] POST /api/photos - upload new photo (admin only)
- [x] PUT /api/photos/:id - update photo (admin only)
- [x] DELETE /api/photos/:id - delete photo (admin only)
- [x] POST /api/categories - create category (admin only)
- [x] PUT /api/categories/:id - update category (admin only)
- [x] DELETE /api/categories/:id - delete category (admin only)

## File Storage
- [ ] Configure S3 for image storage
- [ ] Implement image upload to S3 (currently using base64 preview)
- [ ] Generate presigned URLs for images

## Testing
- [x] Write unit tests for API endpoints
- [ ] Write tests for admin functions
- [ ] Test photo upload functionality
- [ ] Test gallery filtering

## Deployment
- [x] Set up website title and logo
- [ ] Create checkpoint
- [ ] Deploy to production
