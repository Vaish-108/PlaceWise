# PlaceWise - Interview Notes

## Project Name

PlaceWise

## Project Type

AI-Powered Placement Portal

## Problem Statement

Students often do not know:

* Whether they are eligible for a company
* Which skills they are missing
* Which companies match their profile

The placement process is often manual and difficult to track.

## Solution

PlaceWise is a web application that helps:

* Students create profiles
* Companies post opportunities
* Students check eligibility
* AI analyzes profile-company matching
* AI suggests improvements
* Admin manages support tickets

## Tech Stack

Frontend:

* React

Backend:

* Node.js
* Express.js

Database:

* MongoDB Atlas

Authentication:

* JWT
* bcryptjs

## Current Architecture

React Frontend
↓
Express Backend
↓
MongoDB Atlas

## Features Completed

* Student Registration
* Student Login
* Password Hashing
* JWT Authentication
* Protected Routes
* Student Profile Update

## Interview Explanation (Current)

A student registers on the platform. The password is hashed using bcrypt before storage in MongoDB. During login, the password is compared with the hashed password. If authentication succeeds, a JWT token is generated. Protected routes verify the JWT token before allowing access to profile information.



### Why authService.js?

In React applications, API logic is separated from UI components.

Benefits:

* Cleaner code
* Easier maintenance
* Reusable API functions
* Better project structure

Instead of directly calling axios in every page, all authentication-related API calls are placed inside authService.js.



### React Register Flow

User enters:

* Name
* Email
* Password

Flow:

React Form
↓
handleSubmit()
↓
registerUser()
↓
Axios POST Request
↓
Express Register API
↓
MongoDB
↓
Success Response
↓
Display Message on UI

This follows a client-server architecture where React acts as the client and Express acts as the backend API server.

---



### Interview Question

Q: Explain the registration flow in your project.

Answer:

The user fills the registration form in React. Form data is stored using useState. When the form is submitted, an Axios POST request is sent to the Express backend. The backend validates the user, hashes the password using bcrypt, and stores the data in MongoDB Atlas. A success response is returned to React and displayed to the user.




----




### Why store JWT in localStorage?

After login, the backend returns a JWT token.

The token is stored in localStorage so that the user remains logged in even after refreshing the page.

Future API requests include this token in the Authorization header, allowing protected routes to verify the user's identity.




---



### Interview Question

Q: How does authentication work in your project?

Answer:

A user registers through the React frontend. The backend hashes the password using bcrypt before storing it in MongoDB.

When the user logs in, the backend verifies the password and generates a JWT token.

The token is stored in localStorage on the frontend. For protected API requests, the token is sent in the Authorization header as a Bearer Token.

The backend middleware verifies the token before granting access to protected routes.



----



### Dashboard Profile Fetch Flow

When the dashboard loads:

1. React reads the JWT token from localStorage.
2. The token is sent to the backend in the Authorization header.
3. JWT middleware verifies the token.
4. The backend returns the student's profile.
5. React stores the profile in state and displays it using ProfileCard.

This demonstrates authenticated communication between frontend and backend.


---


### Interview Question

Q: How does your dashboard know which user is logged in?

Answer:

After login, a JWT token is stored in localStorage.

When the dashboard loads, React reads the token and sends it in the Authorization header.

The backend verifies the token using JWT middleware and extracts the user's ID.

Using that ID, the backend fetches the correct student profile from MongoDB and returns it to the frontend.


---


### What is a Protected Route?

A protected route restricts access to authenticated users only.

In PlaceWise, the ProtectedRoute component checks whether a JWT token exists in localStorage.

If no token is present, the user is redirected to the Login page.

If a token exists, the requested page is rendered.

This prevents unauthorized users from accessing dashboard pages.


---


### Interview Question

Q: How did you implement routing in React?

Answer:

I used React Router DOM to create client-side routes. The application has separate routes for login, registration, and dashboard. ProtectedRoute is used as a wrapper around private pages. It checks the JWT token stored in localStorage and allows only authenticated users to access protected pages.


---


### Profile Update Flow

The profile page first fetches existing user data using the JWT protected profile API.

The user edits fields in React state.

On submission, React sends a PUT request with updated data and JWT token.

The backend verifies the token, updates the MongoDB document, and returns the updated profile.



---


### Interview Question

Q: How did you implement profile editing?

Answer:

I created a separate Profile component in React. When the page loads, it fetches the existing user data using a JWT protected API. The user updates fields, and on submit React sends a PUT request containing updated data along with the JWT token. The backend verifies authentication and updates the MongoDB document.

Q: Why separate ProfileCard and Profile components?

Answer:

ProfileCard is responsible only for displaying user information, while Profile handles updating data. Separating responsibilities makes components reusable and easier to maintain.



---



### Interview Question

Q: How is company data stored in your project?

Answer:

Companies are stored as separate MongoDB documents using a Company schema. Each company contains job-related requirements like role, package, required skills, and minimum CGPA. This data is later used for student eligibility checking and AI-based matching.

Q: Why create a separate Company model?

Answer:

Students and companies have different data structures and responsibilities. Keeping separate models improves database organization and makes the system scalable.



---



### Interview Question

Q: How are companies displayed in the frontend?

Answer:

The Companies page uses a GET API request to fetch company data from the Express backend. The backend retrieves company documents from MongoDB and sends them to React. React stores the data in state and renders reusable CompanyCard components for each company.

Q: Why create CompanyCard separately?

Answer:

Reusable components avoid repeating UI code. If the company design changes, updating CompanyCard automatically updates every company listing.



---



### Interview Question

Q: Explain the company listing feature.

Answer:

Company data is stored in MongoDB using the Company model. The React Companies page sends a GET request through Axios to the backend API. The Express controller fetches all companies from MongoDB and returns the data. React stores the response in state and displays each company using a reusable CompanyCard component.

Q: Why use reusable components?

Answer:

Reusable components improve maintainability. CompanyCard handles only the presentation of company details, while Companies page manages data fetching logic.



---



### Interview Question

Q: How does your eligibility system work?

Answer:

The system compares student data with company requirements. It checks whether the student's CGPA satisfies the company's minimum requirement and whether the required skills are present. The matching service returns eligibility status, matched skills, and missing skills.

This logic is separated into a service layer so it can later be enhanced with AI recommendations.



---


### Interview Question

Q: How does your placement matching algorithm work?

Answer:

The matching service compares student data with company requirements.

First, it checks whether the student's CGPA is greater than or equal to the company's minimum CGPA requirement.

Then it compares student skills with required company skills.

The system returns eligibility status along with matched and missing skills.

This modular service design allows future integration of AI recommendations.

Q: Why create a separate matching service?

Answer:

Business logic should not be written directly inside controllers. The service layer keeps the matching algorithm separate, reusable, and easier to improve with AI features.



---



### Interview Question

Q: How are jobs connected with companies in your database?

Answer:

I used MongoDB references. The Job model stores the company's ObjectId using Mongoose reference. When fetching jobs, I use populate() to retrieve company details along with job information.

This creates a relationship between Company and Job collections.

Q: Why separate Job and Company models?

Answer:

A company can have multiple job openings. Separating them avoids duplicate company data and follows database normalization principles.



---



### Interview Question

Q: How does the job listing feature work?

Answer:

Companies create job openings which are stored in MongoDB using the Job model. The frontend sends a GET request to the backend API. The backend fetches jobs using Mongoose and populate() is used to retrieve company details. React receives the data and renders reusable JobCard components.

Q: Why use JobCard component?

Answer:

JobCard separates UI logic from data fetching logic. It makes the component reusable for multiple job listings.



---



### Interview Question

Q: Why did you use external application links instead of storing applications internally?

Answer:

Many companies already have their own recruitment systems. Instead of replacing them, PlaceWise integrates with existing hiring workflows by allowing companies to provide their official application links.

Q: How does the Apply button work?

Answer:

The job document stores the application URL. When a student clicks Apply, React accesses this URL and opens the company's application page in a new browser tab.



---




