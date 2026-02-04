# Campus Placement Job Portal - Project Summary

## Overview

A comprehensive full-stack job portal system designed for campus placements, facilitating seamless interaction between Students, Companies, and University Admins.

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Resume Parsing**: pdf-parse, mammoth
- **Email**: Nodemailer
- **Validation**: Joi

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (Shadcn/UI style)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router
- **Notifications**: Sonner

## Key Features Implemented

### 1. Authentication & Authorization
- ✅ Multi-role authentication (Student, Company, Admin)
- ✅ JWT-based secure authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and endpoints

### 2. Student Features
- ✅ Profile management (personal info, education, skills)
- ✅ Resume upload (PDF/DOCX)
- ✅ Resume parsing (extracts skills, contact info)
- ✅ Job browsing and search
- ✅ Job application submission
- ✅ Application status tracking
- ✅ Social links (GitHub, LinkedIn)

### 3. Company Features
- ✅ Company profile management
- ✅ Job posting (CRUD operations)
- ✅ Application management
- ✅ Application status updates
- ✅ Company verification system
- ✅ Job filtering and eligibility criteria

### 4. Admin Features
- ✅ Dashboard with placement statistics
- ✅ Company verification workflow
- ✅ Student management
- ✅ System overview and analytics

### 5. Job Management
- ✅ Job posting with detailed requirements
- ✅ Eligibility criteria (CGPA, branches)
- ✅ Application deadline management
- ✅ Job search and filtering
- ✅ Package information (LPA)

### 6. Application Workflow
- ✅ Application submission
- ✅ Status tracking (Applied → Shortlisted → Interviewing → Selected/Rejected)
- ✅ Resume attachment
- ✅ Cover letter support

### 7. Notifications
- ✅ In-app notifications
- ✅ Email notifications (configurable)
- ✅ Application status update alerts
- ✅ Notification read/unread tracking

### 8. Resume Parsing
- ✅ PDF parsing support
- ✅ DOCX parsing support
- ✅ Automatic skill extraction
- ✅ Contact information extraction
- ✅ Experience extraction

## Database Schema

The database includes 9 main tables:
1. **users** - Base user table with authentication
2. **students** - Student profiles
3. **student_education** - Education history
4. **student_skills** - Skills inventory
5. **companies** - Company profiles
6. **jobs** - Job postings
7. **applications** - Job applications
8. **notifications** - User notifications
9. **parsed_resume_data** - Extracted resume data

See `docs/database-schema.md` for complete schema details.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Student Endpoints
- `GET /api/students/profile` - Get profile
- `PUT /api/students/profile` - Update profile
- `POST /api/students/education` - Add education
- `POST /api/students/skills` - Add skill
- `POST /api/students/resume/upload` - Upload resume
- `GET /api/students/applications` - Get applications
- `POST /api/students/applications` - Apply for job

### Company Endpoints
- `GET /api/companies/profile` - Get profile
- `PUT /api/companies/profile` - Update profile
- `GET /api/companies/jobs` - Get company jobs
- `POST /api/companies/jobs` - Create job
- `PUT /api/companies/jobs/:id` - Update job
- `DELETE /api/companies/jobs/:id` - Close job
- `GET /api/companies/jobs/:id/applications` - Get applications
- `PUT /api/companies/jobs/:id/applications/:appId/status` - Update status

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/companies/pending` - Pending companies
- `POST /api/admin/companies/:id/verify` - Verify company
- `POST /api/admin/companies/:id/reject` - Reject company
- `GET /api/admin/students` - Get all students

### Public Endpoints
- `GET /api/jobs` - Browse jobs
- `GET /api/jobs/:id` - Job details

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

See `docs/api-documentation.md` for complete API documentation.

## Project Structure

```
campus-placement-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, migrations
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, upload
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helpers (parser, notifications)
│   │   └── app.js          # Express app
│   ├── uploads/            # Resume storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   ├── utils/          # Utilities
│   │   └── App.jsx         # Main app
│   └── package.json
└── docs/                   # Documentation
```

## Setup Instructions

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npm run migrate
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Create Admin User:**
   ```bash
   cd backend
   npm run create-admin
   ```

See `SETUP.md` for detailed setup instructions.

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ File type validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration

## Future Enhancements

As outlined in `docs/roadmap.md`, potential enhancements include:
- Advanced search and filtering
- Interview scheduling system
- Resume builder tool
- Analytics and reporting
- Real-time chat
- Job recommendation system
- Mobile app support

## Testing

The application is ready for testing. Key test scenarios:
1. Student registration and profile creation
2. Company registration and verification
3. Job posting and management
4. Application submission and tracking
5. Resume upload and parsing
6. Admin dashboard and company verification

## Documentation

- **Database Schema**: `docs/database-schema.md`
- **API Documentation**: `docs/api-documentation.md`
- **Implementation Roadmap**: `docs/roadmap.md`
- **Setup Guide**: `SETUP.md`

## Notes

- Resume parsing accuracy depends on resume format consistency
- Email notifications require SMTP configuration in `.env`
- File uploads are stored locally (consider cloud storage for production)
- Admin users must be created manually or via script

## License

ISC

---

**Project Status**: ✅ Core features implemented and ready for development/testing


