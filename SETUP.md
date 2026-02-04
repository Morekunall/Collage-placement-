# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus_placement
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

5. Create the PostgreSQL database:
```sql
CREATE DATABASE campus_placement;
```

6. Run database migrations:
```bash
npm run migrate
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are set):
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Creating an Admin User

To create an admin user, you'll need to insert it directly into the database:

```sql
-- First, create the user (you'll need to hash the password using bcrypt)
-- For testing, you can use this Node.js script:

-- Run this in Node.js REPL or create a script:
const bcrypt = require('bcryptjs');
const password = 'admin123'; // Change this
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);

-- Then insert into database:
INSERT INTO users (email, password, role, is_active, is_verified)
VALUES ('admin@university.edu', '<hashed_password>', 'admin', true, true);
```

Or use this quick script:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

Then use the hashed password in the SQL insert statement.

## Project Structure

```
campus-placement-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, upload middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions (resume parser, notifications)
│   │   └── app.js           # Express app entry point
│   ├── uploads/             # Resume uploads directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # State management
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
└── docs/                    # Documentation
```

## Testing the Application

1. **Register as a Student:**
   - Go to `/register`
   - Select "Student" role
   - Fill in the form and register

2. **Register as a Company:**
   - Go to `/register`
   - Select "Company" role
   - Fill in company details
   - Note: Company needs admin verification before posting jobs

3. **Login:**
   - Use registered credentials to login
   - You'll be redirected to your role-specific dashboard

4. **Admin Functions:**
   - Login as admin
   - Verify companies from the admin dashboard
   - View placement statistics

## API Endpoints

All API endpoints are documented in `docs/api-documentation.md`

Base URL: `http://localhost:5000/api`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in backend `.env`
- Update frontend proxy in `vite.config.js`

### Resume Upload Issues
- Ensure `uploads/` directory exists in backend
- Check file size limits (default: 5MB)
- Verify file types (PDF/DOCX only)

### CORS Issues
- Update `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `backend/src/app.js`

## Next Steps

Refer to `docs/roadmap.md` for the complete implementation roadmap and future enhancements.


