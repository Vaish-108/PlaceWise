# PlaceWise — AI-Powered Placement Portal

PlaceWise is a full-stack placement management platform that helps students evaluate job readiness, analyze resumes, receive AI-driven improvement suggestions, and manage support tickets through an integrated help desk.

## Project Overview

Students can register, maintain profiles, upload resumes, explore companies and jobs, receive AI match scores, and view personalized placement readiness insights. Admins can manage support tickets through dedicated backend APIs.

## Features

- User registration and JWT authentication
- Student profile management (CGPA, branch, skills)
- Company and job listings
- Resume upload with PDF text extraction and skill detection
- AI match score engine (profile + resume vs job requirements)
- AI placement readiness dashboard with strengths, weaknesses, and priority actions
- Admin help desk ticket system
- Responsive React frontend with protected routes

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| PDF Parsing | pdf-parse |

## Installation

### Prerequisites

- Node.js 20+
- MongoDB Atlas account
- npm

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

## Screenshots

> Add screenshots here after deployment:
>
> - Login Page
> - Student Dashboard
> - AI Dashboard
> - Jobs Page
> - Tickets Page

## API Summary

### Auth APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register student |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/profile` | JWT | Get profile |
| PUT | `/api/auth/profile` | JWT | Update profile |

### Company APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/companies` | No | Create company |
| GET | `/api/companies` | No | List companies |

### Job APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jobs` | No | Create job |
| GET | `/api/jobs` | No | List jobs |

### Resume APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resume/upload` | JWT | Upload and analyze PDF resume |

### Matching APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matching/:companyId` | JWT | Match score vs company |
| GET | `/api/matching/job/:jobId` | JWT | Match score vs job |

### AI APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ai/suggestions` | JWT | Placement readiness and improvement suggestions |

### Ticket APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tickets` | JWT | Create ticket |
| GET | `/api/tickets` | JWT | Get own tickets |
| GET | `/api/tickets/all` | JWT (admin) | Get all tickets |
| PUT | `/api/tickets/:id` | JWT (admin) | Update ticket status/response |

## Project Structure

```
PlaceWise/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── styles/
└── README.md
```

## Future Scope

- LLM-powered resume and suggestion generation
- Email notifications for ticket updates
- Role-based admin dashboard UI
- Deployment to cloud (Render/Vercel + MongoDB Atlas)
- Match score visualization on job cards
- Interview preparation module

## Author

PlaceWise — Final Year / Portfolio Project
