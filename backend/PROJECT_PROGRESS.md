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



### Resume AI Extraction Module Completed

Created:

- backend/services/pdfExtractionService.js
- backend/services/skillExtractionService.js

Updated:

- backend/models/Resume.js
- backend/controllers/resumeController.js

Features:

- Automatic PDF text extraction
- Technical skill extraction
- Resume text stored in MongoDB
- Extracted skills stored in MongoDB
- PDF-only validation
- Automatic cleanup on upload failures

Flow:

Resume Upload
        ↓
PDF Validation
        ↓
PDF Text Extraction
        ↓
Skill Extraction
        ↓
MongoDB Storage
        ↓
API Response with Extracted Skills

Status:
Resume AI Extraction Working



----



### AI Match Score Engine Completed

Created:

- backend/services/skillMergeService.js
- backend/services/matchScoreService.js
- backend/services/recommendationService.js

Updated:

- backend/services/matchingService.js
- backend/controllers/matchingController.js
- backend/routes/matchingRoutes.js

Features:

- AI Match Score calculation
- Profile skills + Resume skills merged
- Duplicate skill removal
- 70/30 weighted scoring algorithm
- Personalized improvement recommendations
- Matched skills detection
- Missing skills detection
- Job-based AI matching endpoint
- Company-based AI matching upgraded

Algorithm:

Skill Score:
(Matched Required Skills / Total Required Skills) × 70

CGPA Score:

Student satisfies minimum CGPA = 30

Otherwise = 0

Final Match Score:

Skill Score + CGPA Score

Flow:

Student Profile
        ↓
Resume Skills
        ↓
Skill Merge
        ↓
Compare with Job Requirements
        ↓
Calculate Skill Score
        ↓
Calculate CGPA Score
        ↓
Generate Recommendation
        ↓
Return AI Match Analysis

APIs:

GET /api/matching/:companyId

GET /api/matching/job/:jobId

Response Includes:

- Match Score
- Eligibility
- Matched Skills
- Missing Skills
- Resume Skills
- Profile Skills
- Recommendation

Tested Successfully:

✅ AI Match Score generated
✅ Company matching working
✅ Job matching working
✅ Resume skills included
✅ Recommendation generated
✅ Missing skills detected
✅ No backend errors

Status:
AI Match Score Engine Working



----

































# 🚀 PlaceWise - Project Progress

**Last Updated:** 14 July 2026

---

# Project Overview

## Project Name
PlaceWise

## Tagline
Your AI-Powered Placement Companion

## Goal

Build an AI-powered placement platform that helps students prepare for placements through resume analysis, company matching, AI guidance, placement readiness analysis, and communication with the placement cell.

The project should feel like a real SaaS product instead of a college CRUD portal.

---

# Tech Stack

## Frontend

- React
- Vite
- Material UI
- React Router
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer
- PDF Parser

---

# Backend Status ✅

Completed Modules

- Authentication
- Student Registration
- Student Login
- JWT Authentication
- Company Module
- Job Module
- Resume Upload
- Resume Parsing
- Skill Extraction
- AI Suggestions
- AI Match Score
- Recommendation Service
- Ticket System
- Admin Dashboard APIs
- Profile APIs

Backend is considered stable.

Future frontend work should reuse existing APIs whenever possible.

---

# Existing Student Pages

Current pages in the frontend:

- Dashboard
- Companies
- Jobs
- Resume
- AI Dashboard
- Profile
- Tickets

---

# Final Student Navigation (Approved)

Navigation should become:

🏠 Workspace

🧠 AI Mentor

🏢 Companies

👤 Profile

💬 Queries

Changes:

Dashboard → Workspace

Tickets → Queries

Remove Resume from sidebar
(Resume functionality moves inside Profile)

Remove Jobs from sidebar
(Jobs will appear inside Company Details)

Routes should continue working.

---

# Product Vision

The project should not feel like:

Dashboard

↓

Companies

↓

Tickets

Instead, the student journey should become:

Login

↓

Workspace

↓

AI Mentor

↓

Companies

↓

Profile

↓

Queries

The AI Mentor should become the main selling point of the application.

---

# Final Workspace Design

Purpose:

The Workspace is the student's home page after login.

It should answer one question:

"What should I do next?"

Sections:

1. Welcome Card

- Student Name
- College
- Branch

2. Placement Status

- Resume Uploaded
- Placement Readiness
- Next Recommended Skill
- Upcoming Company

3. AI Recommendation

Display one important recommendation generated from existing AI APIs.

4. Quick Actions

Cards for:

- AI Mentor
- Companies
- Profile
- Queries

5. Recent Activity

Only display if backend data exists.

Otherwise hide.

---

# Final AI Mentor Design (Approved)

This page is the flagship feature.

It should resemble ChatGPT rather than a dashboard.

Layout:

------------------------------------------------

LEFT SIDEBAR

------------------------------------------------

💬 New Chat

Resume Analysis

Placement Readiness

Skill Gap Analysis

Company Match

Roadmap Generator

Interview Questions

ATS Resume Review

------------------------------------------------

MAIN SCREEN

------------------------------------------------

🧠 PlaceWise AI

Your Personal Placement Assistant

Chat Input

Ask AI Button

Suggested Questions

------------------------------------------------

Example Suggested Questions

- Am I placement ready?
- Review my Resume
- Create my Roadmap
- Generate React Interview Questions
- Compare me with Amazon
- Improve my ATS Score

------------------------------------------------

Important Design Decision

When the student clicks:

Resume Analysis

Placement Readiness

Skill Gap

Company Match

Roadmap

Interview Questions

ATS Resume Review

DO NOT open a new page.

Instead,

Automatically send the corresponding request into the AI conversation area and display the result as if the AI generated it.

This makes AI Mentor feel like ChatGPT.

---

# Companies Module (Approved)

Navigation contains only Companies.

No separate Jobs page.

Companies Page

↓

Company Details

↓

Open Positions

↓

Apply

Company Details should display:

- About Company
- Package
- Eligibility
- Required Skills
- Hiring Process
- AI Match Score
- Open Positions
- Apply Button

---

# Profile Module (Approved)

Profile contains:

- Photo
- Personal Information
- Academic Information
- Skills
- Resume Upload
- Resume Summary
- Edit Profile

No separate Resume page.

---

# Queries Module (Approved)

Rename Tickets

↓

Queries

Backend remains unchanged.

Student should be able to:

- Raise Query
- View Query
- Track Status
- Read Admin Reply

---

# UI Design Principles

Modern

Minimal

Professional

Material UI

Rounded Cards

Consistent Colors

Responsive Layout

Smooth Hover Effects

Proper Empty States

Loading Indicators

No unnecessary dashboards

No information overload

---

# Important Decisions Taken

✅ AI Mentor is the hero feature.

✅ AI page should resemble ChatGPT.

✅ Sidebar for AI tools.

✅ Chat is the main interaction area.

✅ Suggested Questions shown below chat.

✅ Clicking sidebar items generates AI responses inside the chat.

✅ Resume integrated into Profile.

✅ Jobs integrated into Companies.

✅ Backend APIs should be reused.

✅ Avoid unnecessary backend modifications.

---

# Development Roadmap

## Phase 1

Navigation

Status:

⬜ Pending

---

## Phase 2

Workspace

Status:

⬜ Pending

---

## Phase 3

AI Mentor

Status:

⬜ Pending

---

## Phase 4

Companies

Status:

⬜ Pending

---

## Phase 5

Profile

Status:

⬜ Pending

---

## Phase 6

Queries

Status:

⬜ Pending

---

## Phase 7

Landing Page

Status:

⬜ Pending

---

# Working Method

The project will now be built manually with ChatGPT guidance.

For every feature:

1. Understand the requirement.

2. Design the UI.

3. Decide component structure.

4. Implement.

5. Test.

6. Fix.

7. Move to the next step.

No large AI-generated changes.

Every feature should be fully working before moving forward.

---

# Next Immediate Task

Step 1

Update Student Navigation

Requirements:

- Dashboard → Workspace
- Tickets → Queries
- Remove Resume from sidebar
- Remove Jobs from sidebar
- Keep all routes working
- Do not modify backend

After completion:

Update this file and continue with Workspace implementation.

---

# Notes

This file serves as the master reference for the PlaceWise project.

If a new ChatGPT conversation is started, paste this file first so development can continue seamlessly without losing context.


---









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
