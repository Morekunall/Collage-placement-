# Campus Placement Job Portal

A comprehensive job portal system facilitating interaction between Students, Companies, and University Admins.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based Role-Based Access Control (RBAC)

## Project Structure

```
campus-placement-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
└── docs/
    ├── database-schema.md
    ├── api-documentation.md
    └── roadmap.md
```

## Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Features

- Multi-role authentication (Student, Company, Admin)
- Job posting and management
- Resume upload and parsing
- Application tracking
- Admin dashboard
- Notifications system

