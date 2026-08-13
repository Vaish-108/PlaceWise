# PlaceWise — AI-Powered College Placement Portal

> A full-stack AI-powered placement management platform designed to help students manage and prepare for their college placement journey.

## 🚀 Live Demo

[Open PlaceWise Live Demo](https://placewise-1.onrender.com)

## 📌 About the Project

PlaceWise is an AI-powered college placement portal that brings important placement activities into one platform.

The system provides two separate portals:

- Student Portal — for managing profiles, resumes, placement preparation, companies, jobs, AI guidance, and support.
- Admin Portal — for managing students, companies, jobs, announcements, queries, and support tickets.

The platform also integrates AI-based features to provide personalized career and placement guidance.

## ✨ Key Features

### Student Portal

- Student registration and login
- JWT-based authentication
- Student profile management
- Resume upload and management
- Resume analysis
- Skill recommendations
- Company and job exploration
- AI-based company matching
- Placement readiness analysis
- Personalized placement recommendations
- AI Mentor
- Interview preparation
- DSA preparation guidance
- Student support tickets

### Admin Portal

- Admin authentication
- Student management
- Company management
- Job management
- Announcements management
- Student query management
- Support ticket management
- Admin profile management

### AI Features

- AI-powered resume guidance
- Placement readiness analysis
- Interview preparation
- Skill recommendations
- Company matching
- Career guidance
- DSA preparation guidance
- Interactive AI Mentor

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Multer

### Database
- MongoDB Atlas
- Mongoose

### AI
- Groq API / LLM integration

### Deployment and Tools
- Render
- Git
- GitHub

## 🏗️ System Architecture

```text
                    PlaceWise
                       |
          +------------+------------+
          |                         |
          v                         v
   Student Portal             Admin Portal
          |                         |
          +------------+------------+
                       |
                       v
                Express REST APIs
                       |
          +------------+------------+
          |                         |
          v                         v
     MongoDB Atlas              AI Services
````

## 🔐 Authentication

PlaceWise uses JWT-based authentication to secure protected routes and user-specific resources.

```text
User Login
    |
    v
Backend verifies credentials
    |
    v
Password verified using bcrypt
    |
    v
JWT token generated
    |
    v
Token sent with protected API requests
    |
    v
Backend verifies token
    |
    v
Authorized resource returned
```

## 📁 Project Structure

```text
PlaceWise/
|
├── backend/
|   ├── controllers/
|   ├── models/
|   ├── routes/
|   ├── services/
|   ├── middleware/
|   └── server.js
|
├── frontend/
|   ├── src/
|   |   ├── components/
|   |   ├── pages/
|   |   ├── services/
|   |   └── ...
|   └── package.json
|
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Vaish-108/PlaceWise.git
cd PlaceWise
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Create backend environment variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Never upload your actual database connection string, JWT secret, or API key to GitHub.

### 4. Start the backend

```bash
npm start
```

### 5. Install frontend dependencies

Open another terminal.

```bash
cd frontend
npm install
```

### 6. Configure the frontend

Create the frontend environment file with:

```env
VITE_API_URL=http://localhost:5000
```

### 7. Start the frontend

```bash
npm run dev
```

## 🌐 Deployment

PlaceWise is deployed using Render.

### Production Frontend

[https://placewise-1.onrender.com](https://placewise-1.onrender.com)

### Production Backend

[https://placewise-avuk.onrender.com](https://placewise-avuk.onrender.com)

### Database

MongoDB Atlas

The frontend communicates with the deployed backend through the configured API URL.

## 🔄 Deployment Workflow

The project is connected to GitHub and Render.

After making and testing changes locally:

```bash
git add .
git commit -m "Describe your changes"
git push origin master
```

Render automatically detects changes pushed to the connected GitHub branch and deploys the updated application.

The live demo URL remains the same after updates.

## 🔒 Environment Variables

The application uses environment variables for configuration and sensitive credentials.

```text
MONGO_URI
PORT
JWT_SECRET
GROQ_API_KEY
VITE_API_URL
```

Actual secret values should never be committed to GitHub.

## 🔮 Future Improvements

* Multi-college support
* Advanced placement analytics
* More personalized AI recommendations
* Automated interview evaluation
* Advanced admin dashboards
* Improved notification system
* Detailed placement statistics

## 👩‍💻 Developer

Vaishali Bhardwaj

B.Tech — Computer Science & Engineering (AI)

---

⭐ If you find PlaceWise interesting, consider giving the repository a star.

````

