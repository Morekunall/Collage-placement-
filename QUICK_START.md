# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb campus_placement

# Or using psql:
psql -U postgres
CREATE DATABASE campus_placement;
\q
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run create-admin  # Create admin user
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📝 Default Credentials

After running `npm run create-admin`, use the credentials you provided to login as admin.

## 🎯 Quick Test Flow

1. **Register as Student**
   - Go to http://localhost:3000/register
   - Select "Student" role
   - Fill form and register

2. **Upload Resume**
   - Login as student
   - Go to profile
   - Upload a PDF/DOCX resume

3. **Register as Company**
   - Register with "Company" role
   - Wait for admin verification

4. **Admin Verification**
   - Login as admin
   - Go to admin dashboard
   - Verify the company

5. **Post a Job**
   - Login as verified company
   - Create a job posting

6. **Apply for Job**
   - Login as student
   - Browse jobs
   - Apply for a job

7. **Track Application**
   - Student can see application status
   - Company can update status
   - Student receives notification

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus_placement
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 Documentation

- Full Setup: `SETUP.md`
- API Docs: `docs/api-documentation.md`
- Database Schema: `docs/database-schema.md`
- Roadmap: `docs/roadmap.md`
- Project Summary: `PROJECT_SUMMARY.md`

## ⚠️ Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Port already in use?**
- Change PORT in backend `.env`
- Update frontend proxy config

**Resume upload fails?**
- Check `uploads/` directory exists
- Verify file is PDF or DOCX
- Check file size (max 5MB)

## 🎉 You're Ready!

The application is now running. Start testing the features!


