# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user (Student or Company).

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "enrollmentNumber": "EN2024001",
  "branch": "Computer Science",
  "cgpa": 8.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

---

## Student Endpoints

### GET /students/profile
Get current student's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "student@example.com",
    "enrollmentNumber": "EN2024001",
    "branch": "Computer Science",
    "cgpa": 8.5,
    "education": [...],
    "skills": [...],
    "resumeUrl": "/uploads/resume.pdf"
  }
}
```

### PUT /students/profile
Update student profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "branch": "Computer Science",
  "cgpa": 8.7,
  "graduationYear": 2025,
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

### POST /students/education
Add education history.

**Request Body:**
```json
{
  "degree": "B.Tech",
  "institution": "University Name",
  "startYear": 2021,
  "endYear": 2025,
  "percentage": 85.5
}
```

### POST /students/skills
Add skill.

**Request Body:**
```json
{
  "skillName": "JavaScript",
  "proficiencyLevel": "advanced"
}
```

### POST /students/resume/upload
Upload resume file.

**Request:** Multipart form-data
- `resume`: File (PDF/DOCX)

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded and parsed successfully",
  "data": {
    "resumeUrl": "/uploads/resume.pdf",
    "parsedData": {
      "skills": ["JavaScript", "React", "Node.js"],
      "contactEmail": "student@example.com",
      "contactPhone": "+1234567890"
    }
  }
}
```

### GET /students/applications
Get all applications by student.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "job": {
        "id": "uuid",
        "title": "Software Engineer",
        "companyName": "Tech Corp",
        "packageLpa": 12.5
      },
      "status": "shortlisted",
      "appliedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### POST /students/applications
Apply for a job.

**Request Body:**
```json
{
  "jobId": "uuid",
  "coverLetter": "Optional cover letter text"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "uuid",
    "status": "applied"
  }
}
```

---

## Company Endpoints

### GET /companies/profile
Get current company's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "Tech Corp",
    "industry": "Technology",
    "website": "https://techcorp.com",
    "description": "Company description",
    "isVerified": true,
    "activeJobsCount": 5
  }
}
```

### PUT /companies/profile
Update company profile.

**Request Body:**
```json
{
  "companyName": "Tech Corp",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "description": "Updated description",
  "address": "123 Tech Street",
  "phone": "+1234567890"
}
```

### GET /companies/jobs
Get all jobs posted by company.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineer",
      "description": "Job description",
      "packageLpa": 12.5,
      "minCgpa": 7.5,
      "eligibleBranches": ["Computer Science", "IT"],
      "applicationDeadline": "2024-02-15",
      "isActive": true,
      "applicationsCount": 25
    }
  ]
}
```

### POST /companies/jobs
Create a new job posting.

**Request Body:**
```json
{
  "title": "Software Engineer",
  "description": "We are looking for a skilled software engineer...",
  "packageLpa": 12.5,
  "minCgpa": 7.5,
  "eligibleBranches": ["Computer Science", "IT", "ECE"],
  "location": "Bangalore",
  "jobType": "full-time",
  "applicationDeadline": "2024-02-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "jobId": "uuid",
    "title": "Software Engineer"
  }
}
```

### PUT /companies/jobs/:jobId
Update a job posting.

**Request Body:** Same as POST /companies/jobs

### DELETE /companies/jobs/:jobId
Delete/Close a job posting.

**Response:**
```json
{
  "success": true,
  "message": "Job closed successfully"
}
```

### GET /companies/jobs/:jobId/applications
Get all applications for a specific job.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "enrollmentNumber": "EN2024001",
        "cgpa": 8.5,
        "branch": "Computer Science"
      },
      "status": "applied",
      "resumeUrl": "/uploads/resume.pdf",
      "appliedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### PUT /companies/jobs/:jobId/applications/:applicationId/status
Update application status.

**Request Body:**
```json
{
  "status": "shortlisted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "applicationId": "uuid",
    "newStatus": "shortlisted"
  }
}
```

---

## Admin Endpoints

### GET /admin/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "placedStudents": 350,
    "unplacedStudents": 150,
    "totalCompanies": 50,
    "verifiedCompanies": 45,
    "pendingCompanies": 5,
    "activeJobs": 120,
    "totalApplications": 2500
  }
}
```

### GET /admin/companies/pending
Get list of companies pending verification.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "companyName": "New Corp",
      "industry": "Technology",
      "website": "https://newcorp.com",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

### POST /admin/companies/:companyId/verify
Verify a company registration.

**Response:**
```json
{
  "success": true,
  "message": "Company verified successfully"
}
```

### POST /admin/companies/:companyId/reject
Reject a company registration.

**Request Body:**
```json
{
  "reason": "Invalid company information"
}
```

### GET /admin/students
Get all students with filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `branch`: Filter by branch
- `isPlaced`: Filter by placement status

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  }
}
```

---

## Job Endpoints (Public)

### GET /jobs
Get all active job listings.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `branch`: Filter by eligible branch
- `minPackage`: Minimum package filter
- `search`: Search in title/description

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Software Engineer",
        "companyName": "Tech Corp",
        "packageLpa": 12.5,
        "minCgpa": 7.5,
        "eligibleBranches": ["Computer Science", "IT"],
        "location": "Bangalore",
        "applicationDeadline": "2024-02-15"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /jobs/:jobId
Get job details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Software Engineer",
    "description": "Full job description",
    "company": {
      "id": "uuid",
      "companyName": "Tech Corp",
      "industry": "Technology",
      "website": "https://techcorp.com"
    },
    "packageLpa": 12.5,
    "minCgpa": 7.5,
    "eligibleBranches": ["Computer Science", "IT"],
    "location": "Bangalore",
    "jobType": "full-time",
    "applicationDeadline": "2024-02-15"
  }
}
```

---

## Notification Endpoints

### GET /notifications
Get all notifications for current user.

**Query Parameters:**
- `isRead`: Filter by read status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "application_status_update",
      "title": "Application Status Updated",
      "message": "Your application for Software Engineer has been shortlisted",
      "isRead": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### PUT /notifications/:notificationId/read
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

