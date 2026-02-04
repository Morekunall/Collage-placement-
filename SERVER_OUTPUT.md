# Server Startup Output

When you start the backend server with `npm start` or `node src/app.js`, you should see the following output:

## Expected Console Output

```
Registering routes...
✓ Auth routes registered
✓ Student routes registered
✓ Company routes registered
✓ Admin routes registered
✓ Job routes registered
✓ Notification routes registered
All routes registered successfully!
Server is running on port 5000
```

## Route Registration Details

All routes are successfully registered:

1. **Auth Routes** (`/api/auth`)
   - POST `/api/auth/register` - User registration
   - POST `/api/auth/login` - User login

2. **Student Routes** (`/api/students`)
   - GET `/api/students/profile` - Get student profile
   - PUT `/api/students/profile` - Update student profile
   - POST `/api/students/education` - Add education
   - POST `/api/students/skills` - Add skill
   - POST `/api/students/resume/upload` - Upload resume
   - GET `/api/students/applications` - Get applications
   - POST `/api/students/applications` - Apply for job

3. **Company Routes** (`/api/companies`)
   - GET `/api/companies/profile` - Get company profile
   - PUT `/api/companies/profile` - Update company profile
   - GET `/api/companies/jobs` - Get company jobs
   - POST `/api/companies/jobs` - Create job
   - PUT `/api/companies/jobs/:jobId` - Update job
   - DELETE `/api/companies/jobs/:jobId` - Delete job
   - GET `/api/companies/jobs/:jobId/applications` - Get job applications
   - PUT `/api/companies/jobs/:jobId/applications/:applicationId/status` - Update application status

4. **Admin Routes** (`/api/admin`)
   - GET `/api/admin/dashboard` - Get admin dashboard
   - GET `/api/admin/companies/pending` - Get pending companies
   - POST `/api/admin/companies/:companyId/verify` - Verify company
   - POST `/api/admin/companies/:companyId/reject` - Reject company
   - GET `/api/admin/students` - Get all students

5. **Job Routes** (`/api/jobs`)
   - GET `/api/jobs` - Get all jobs (public)
   - GET `/api/jobs/:jobId` - Get job by ID (public)

6. **Notification Routes** (`/api/notifications`)
   - GET `/api/notifications` - Get notifications
   - PUT `/api/notifications/:notificationId/read` - Mark as read

## Request Logging

When a request is made, you'll see logs like:
```
2024-01-01T12:00:00.000Z - GET /api/jobs
2024-01-01T12:00:01.000Z - POST /api/auth/login
```

## Health Check

Test the server is running:
```
GET http://localhost:5000/api/health
Response: {"success":true,"message":"Server is running"}
```

## Status

✅ **All routes are working correctly!**

The server is running and all routes are registered successfully. You can now:
- Access the API at `http://localhost:5000/api`
- Test endpoints using the frontend or API tools like Postman
- View request logs in the console for debugging
