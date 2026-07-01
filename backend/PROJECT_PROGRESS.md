# PlaceWise Project Progress

## Project Goal

AI-Powered Placement Portal for Colleges

Features:

* Student Profiles
* Company Listings
* AI Eligibility & Match Analysis
* AI Improvement Suggestions
* Admin Help Desk / Ticket System

---

## Tech Stack

### Frontend

* React
* React Router
* Context API

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* bcryptjs

---

## Folder Structure

### Backend

backend/
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
├── uploads
├── server.js
├── .env
└── package.json

### Frontend

src/
├── assets
├── components
├── pages
├── layouts
├── services
├── context
├── hooks
├── utils
├── routes
├── App.jsx
├── main.jsx
└── index.css

---

## Completed Features

### Database

* MongoDB Atlas connected successfully
* MongoDB Compass installed and connected

### Backend Setup

* Express server setup
* Environment variables configured
* Database connection configured

### Student Model

Fields:

* name
* email
* password
* branch
* year
* cgpa
* skills
* role

### Authentication

#### Register API

POST /api/auth/register

Completed:

* User registration
* Duplicate email validation
* MongoDB storage

#### Password Security

* bcryptjs installed
* Password hashing implemented

#### Login API

POST /api/auth/login

Completed:

* User lookup
* Password comparison
* JWT token generation

#### JWT Middleware

File:
middleware/authMiddleware.js

Completed:

* Token extraction
* Token verification
* Protected route support

#### Protected Route

GET /api/auth/profile

Completed:

* User profile fetch
* Password excluded
* JWT verification successful

---

## Tested Successfully

* Register user via Postman
* Login user via Postman
* JWT token received
* Protected profile route accessed using Bearer Token
* User data visible in MongoDB Atlas

---

## Current Status

Authentication System Completed

---

## Next Task

Student Profile Update API

Fields:

* branch
* year
* cgpa
* skills

Route:
PUT /api/auth/profile

---





### Student Profile Module

Completed:

* GET /api/auth/profile
* PUT /api/auth/profile

Protected using JWT Authentication

Student fields:

* name
* email
* branch
* year
* cgpa
* skills

Tested Successfully:

* Profile retrieval
* Profile update
* MongoDB persistence
* JWT verification



### Authentication Backend Completed

Completed:

* MongoDB Atlas Connection
* Student Model
* Register API
* bcrypt Password Hashing
* Login API
* JWT Token Generation
* JWT Middleware
* Protected Profile Route
* Update Profile Route

Student Profile Data:

* branch
* year
* cgpa
* skills

Status:
Backend Authentication Complete



### Frontend Integration Started

Created:

src/services/authService.js

Purpose:

* Register API calls
* Login API calls
* Profile API calls
* Update Profile API calls

Status:
Frontend Authentication Integration Started




### React Register Page Started

Created:

* src/services/authService.js
* src/pages/Register/Register.jsx

Completed:

* Authentication API service layer

Next:

* Connect Register Page to Backend API



---


### React Registration Module Completed

Completed:

* authService.js
* Register.jsx
* Axios Integration
* React Form Handling
* Backend Communication
* MongoDB Storage via Frontend

Successfully Tested:

* User registration from React UI
* Data stored in MongoDB Atlas

Status:
Frontend Registration Complete


---


### Frontend Authentication Completed

Completed:

* Register Page
* Login Page
* Axios Integration
* JWT Token Storage
* localStorage Authentication

Flow:

Register
↓
Backend API
↓
MongoDB

Login
↓
JWT Token
↓
localStorage

Status:
Authentication Module Fully Completed


---


### Student Dashboard Completed

Components:

* StudentDashboard.jsx
* ProfileCard.jsx

Features:

* JWT Token Read from localStorage
* Protected Profile Fetch
* Dashboard UI
* Logout Functionality
* Profile Display

Flow:
Login
↓
Token Stored
↓
Dashboard Loads
↓
Profile Fetched
↓
Profile Displayed

Status:
Student Dashboard Working



---


### Routing Module Started

Created:

* AppRoutes.jsx
* ProtectedRoute.jsx

Goal:

* Route-based navigation
* Protected Dashboard
* Automatic Authentication Checks



---



### React Routing Completed

Completed:

* React Router installation
* AppRoutes.jsx
* ProtectedRoute.jsx
* Route navigation

Routes created:

/register
/login
/dashboard

Authentication Flow:

No token
↓
Login

Token exists
↓
Dashboard

Status:
Frontend Navigation Working




----



### Student Profile Module Completed

Completed:

* Student Dashboard
* ProfileCard Component
* Profile Page
* Fetch Existing Profile Data
* Update Profile API Integration

Student can now:

* View personal details
* Update branch
* Update year
* Update CGPA
* Update skills

Flow:

React Profile Page
↓
Axios PUT Request
↓
JWT Authentication
↓
Express Controller
↓
MongoDB Update

Status:
Student Module Completed




----



### Company Module Started

Created:

backend/models/Company.js

Goal:

Store company/job requirements:

* Company name
* Role
* Package
* Required skills
* Minimum CGPA

Status:
Company Backend Development Started




----



### Company Backend Module Completed

Created:

* Company Model
* Company Controller
* Company Routes

APIs Completed:

POST /api/companies

Purpose:
Add new company/job requirement

GET /api/companies

Purpose:
Fetch available companies

Company Data:

* Company Name
* Role
* Package
* Required Skills
* Minimum CGPA

Tested Successfully:

* Company creation through Postman
* Company fetching through API

Status:
Company Backend Working




----



### Company Frontend Module Started

Created:

* src/pages/Companies/Companies.jsx

Goal:

Display available companies from backend API.

Flow:

React
↓
Axios GET Request
↓
/api/companies
↓
MongoDB Company Data
↓
Display Company Cards

Status:
Company Listing UI Started



----



### Company Frontend Module Completed

Created:

* Companies.jsx
* CompanyCard.jsx
* companyService.js

Features Completed:

* Fetch companies from backend
* Display company information
* Reusable CompanyCard component
* React + Express + MongoDB integration

API Used:

GET /api/companies

Status:
Company Listing Working




----



### Student Company Matching Module Started

Created:

backend/services/matchingService.js

Purpose:

Compare:

Student Profile
VS
Company Requirements

Checks:

* Minimum CGPA
* Required Skills

Output:

Eligible / Not Eligible

Status:
Matching Algorithm Development Started



----



### Student-Company Matching Engine Completed

Created:

* matchingService.js
* matchingController.js
* matchingRoutes.js

Feature:

Student profile is compared with company requirements.

Checks:

1. CGPA eligibility
2. Required skill matching

Response provides:

* Eligibility status
* CGPA match result
* Skill match result
* Matched skills
* Missing skills

API:

GET /api/matching/:companyId

Status:
Placement Matching Engine Working



----



### Job Module Started

Created:

backend/models/Job.js

Purpose:

Store company job openings.

Job contains:

- Company reference
- Job title
- Description
- Package
- Required skills
- Minimum CGPA

Status:
Job Backend Development Started


----



### Job Backend Controller Started

Created:

backend/models/Job.js

Next:

- Job Controller
- Job Routes
- Job APIs

Purpose:

Allow companies to create job openings and students to view them.



----



### Job Backend Completed

Created:

- Job.js
- jobController.js
- jobRoutes.js


APIs Completed:

POST /api/jobs

Purpose:
Create new job openings


GET /api/jobs

Purpose:
Fetch all available jobs


Features:

- Job linked with Company using ObjectId
- Company details fetched using populate()


Status:
Job Creation Backend Working



----



### Job Frontend Module Started

Created:

src/pages/Jobs/Jobs.jsx

src/components/JobCard/JobCard.jsx


Purpose:

Display available job openings to students.

Flow:

React
↓
Axios GET Request
↓
/api/jobs
↓
MongoDB Jobs
↓
Job Cards


Status:
Job Listing UI Started



----



### Job Frontend Module Completed

Created:

Frontend:

- Jobs.jsx
- JobCard.jsx
- jobService.js


Features:

- Fetch jobs from backend
- Display company name
- Display role
- Display package
- Display required skills
- Display minimum CGPA


API Used:

GET /api/jobs


Status:
Job Listing Working



----



### Job Application Link Feature Started

Updated:

backend/models/Job.js


Added:

applicationLink


Purpose:

Allow companies to attach their official application form/link with job postings.

Flow:

Company Job Post
        ↓
Student Views Job
        ↓
Apply Button Redirects to External Form


Status:
Job Model Updated



----



### External Job Application Flow Completed

Updated:

Job Model

Added:

- applicationLink


Frontend:

Updated JobCard.jsx


Feature:

Students can directly apply through company provided application links.


Flow:

Company Job Post
        ↓
Student Views Job
        ↓
Apply Button
        ↓
External Company Form


Status:
Apply Redirect Working



----



### Resume Module Started

Created:

backend/models/Resume.js


Purpose:

Store student resume information.


Planned features:

- Resume upload
- Store resume file path
- Extract resume text
- AI skill extraction
- Skill gap analysis


Status:
Resume Backend Development Started



----





## Future Roadmap

1. Student Profile Update API
2. React Register Page Integration
3. React Login Page Integration
4. Protected Dashboard
5. Company Module
6. Job Listings
7. AI Match Percentage
8. AI Improvement Suggestions
9. Admin Ticket System
10. Final Deployment
