# Database Schema

## Overview

The database schema is designed to support a multi-tenant campus placement portal with three main user roles: Students, Companies, and Admins.

## Entity Relationship Diagram

```
Users (Base)
├── Students
├── Companies
└── Admins

Jobs
├── Applications
└── Notifications
```

## Tables

### 1. users
Base table for all user types with role-based access.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | 'student', 'company', 'admin' |
| is_active | BOOLEAN | DEFAULT true | Account status |
| is_verified | BOOLEAN | DEFAULT false | Email verification status |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

### 2. students
Extended profile for student users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Student identifier |
| user_id | UUID | FOREIGN KEY → users.id | Reference to users table |
| first_name | VARCHAR(100) | NOT NULL | Student first name |
| last_name | VARCHAR(100) | NOT NULL | Student last name |
| phone | VARCHAR(20) | | Contact number |
| enrollment_number | VARCHAR(50) | UNIQUE | University enrollment ID |
| branch | VARCHAR(100) | | Academic branch/department |
| cgpa | DECIMAL(3,2) | | Current CGPA |
| graduation_year | INTEGER | | Expected graduation year |
| github_url | VARCHAR(255) | | GitHub profile link |
| linkedin_url | VARCHAR(255) | | LinkedIn profile link |
| resume_url | VARCHAR(500) | | Path to uploaded resume |
| is_placed | BOOLEAN | DEFAULT false | Placement status |
| created_at | TIMESTAMP | DEFAULT NOW() | Profile creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

### 3. student_education
Education history for students.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Education record ID |
| student_id | UUID | FOREIGN KEY → students.id | Reference to student |
| degree | VARCHAR(100) | NOT NULL | Degree name (e.g., B.Tech, M.Tech) |
| institution | VARCHAR(255) | NOT NULL | Institution name |
| start_year | INTEGER | | Start year |
| end_year | INTEGER | | End year (or NULL if ongoing) |
| percentage | DECIMAL(5,2) | | Percentage/CGPA |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

### 4. student_skills
Skills associated with students.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Skill record ID |
| student_id | UUID | FOREIGN KEY → students.id | Reference to student |
| skill_name | VARCHAR(100) | NOT NULL | Skill name |
| proficiency_level | VARCHAR(20) | | 'beginner', 'intermediate', 'advanced' |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

### 5. companies
Extended profile for company users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Company identifier |
| user_id | UUID | FOREIGN KEY → users.id | Reference to users table |
| company_name | VARCHAR(255) | NOT NULL | Official company name |
| industry | VARCHAR(100) | | Industry sector |
| website | VARCHAR(255) | | Company website URL |
| description | TEXT | | Company description |
| address | TEXT | | Company address |
| phone | VARCHAR(20) | | Contact number |
| is_verified | BOOLEAN | DEFAULT false | Admin verification status |
| verified_by | UUID | FOREIGN KEY → users.id | Admin who verified |
| verified_at | TIMESTAMP | | Verification timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Profile creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

### 6. jobs
Job postings by companies.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Job identifier |
| company_id | UUID | FOREIGN KEY → companies.id | Reference to company |
| title | VARCHAR(255) | NOT NULL | Job title |
| description | TEXT | NOT NULL | Detailed job description |
| package_lpa | DECIMAL(8,2) | | Package in LPA (Lakhs Per Annum) |
| min_cgpa | DECIMAL(3,2) | | Minimum CGPA requirement |
| eligible_branches | TEXT[] | | Array of eligible branches |
| location | VARCHAR(255) | | Job location |
| job_type | VARCHAR(50) | | 'full-time', 'internship', 'contract' |
| application_deadline | DATE | NOT NULL | Application deadline |
| is_active | BOOLEAN | DEFAULT true | Job posting status |
| created_at | TIMESTAMP | DEFAULT NOW() | Job creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

### 7. applications
Student job applications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Application identifier |
| student_id | UUID | FOREIGN KEY → students.id | Reference to student |
| job_id | UUID | FOREIGN KEY → jobs.id | Reference to job |
| resume_url | VARCHAR(500) | | Path to application resume |
| cover_letter | TEXT | | Optional cover letter |
| status | VARCHAR(50) | DEFAULT 'applied' | 'applied', 'shortlisted', 'interviewing', 'selected', 'rejected' |
| applied_at | TIMESTAMP | DEFAULT NOW() | Application timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last status update time |

### 8. notifications
System notifications for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Notification identifier |
| user_id | UUID | FOREIGN KEY → users.id | Reference to user |
| type | VARCHAR(50) | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| related_id | UUID | | Related entity ID (e.g., application_id) |
| is_read | BOOLEAN | DEFAULT false | Read status |
| created_at | TIMESTAMP | DEFAULT NOW() | Notification creation time |

### 9. parsed_resume_data
Extracted data from resume parsing.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Parsed data identifier |
| student_id | UUID | FOREIGN KEY → students.id | Reference to student |
| resume_url | VARCHAR(500) | NOT NULL | Original resume path |
| extracted_skills | TEXT[] | | Array of extracted skills |
| contact_email | VARCHAR(255) | | Extracted email |
| contact_phone | VARCHAR(20) | | Extracted phone |
| experience_years | INTEGER | | Extracted experience |
| raw_data | JSONB | | Full parsed data as JSON |
| parsed_at | TIMESTAMP | DEFAULT NOW() | Parsing timestamp |

## Relationships

1. **users → students**: One-to-One
2. **users → companies**: One-to-One
3. **users → admins**: One-to-One (admins use users table directly)
4. **students → student_education**: One-to-Many
5. **students → student_skills**: One-to-Many
6. **companies → jobs**: One-to-Many
7. **jobs → applications**: One-to-Many
8. **students → applications**: One-to-Many
9. **users → notifications**: One-to-Many

## Indexes

- `users.email` (UNIQUE)
- `users.role`
- `students.user_id` (UNIQUE)
- `students.enrollment_number` (UNIQUE)
- `companies.user_id` (UNIQUE)
- `jobs.company_id`
- `jobs.is_active`
- `applications.student_id`
- `applications.job_id`
- `applications.status`
- `notifications.user_id`
- `notifications.is_read`

## Sample Queries

### Get all active jobs with company details
```sql
SELECT j.*, c.company_name, c.industry
FROM jobs j
JOIN companies c ON j.company_id = c.id
WHERE j.is_active = true AND j.application_deadline >= CURRENT_DATE
ORDER BY j.created_at DESC;
```

### Get student applications with status
```sql
SELECT a.*, j.title, j.company_id, c.company_name
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN companies c ON j.company_id = c.id
WHERE a.student_id = $1
ORDER BY a.applied_at DESC;
```

### Get placement statistics
```sql
SELECT 
  COUNT(*) FILTER (WHERE is_placed = true) as placed_count,
  COUNT(*) FILTER (WHERE is_placed = false) as unplaced_count,
  COUNT(*) as total_students
FROM students;
```

