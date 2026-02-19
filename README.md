🏋️ GymSync

GymSync is a MERN-based gym coordination platform that helps users plan workouts, monitor gym crowd density, and connect with compatible gym partners.

🚀 Project Vision

GymSync aims to make gym sessions more organized and social by allowing users to:

Schedule planned workout times

View gym crowd density

Find compatible gym partners

Send match requests

Chat after mutual acceptance

🛠️ Tech Stack
Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt (Password Hashing)

Frontend (In Progress)

React.js

🔐 Authentication System (Completed)

The backend currently includes a fully implemented authentication system:

User Registration

User Login

Password Hashing (bcrypt)

JWT Token Generation

Protected Routes Middleware

Secure Environment Variable Handling

📂 Project Structure
gym-sync/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│
├── .gitignore
└── README.md

⚙️ Backend Setup Instructions

Clone the repository:

git clone https://github.com/Vardhan-12/gym-sync.git


Navigate to backend folder:

cd gym-sync/backend


Install dependencies:

npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start server:

npm run dev

🔑 API Endpoints (Current)
Authentication Routes

POST /api/auth/register

POST /api/auth/login

Protected Route Example

GET /api/users/profile

Requires:

Authorization: Bearer <JWT_TOKEN>

📈 Development Status

✅ Authentication System Complete

🔄 User Profile APIs (Next)

🔄 Workout CRUD (Planned)

🔄 Partner Matching Logic (Planned)

🔄 Real-time Chat (Planned)

🎯 Future Enhancements

Workout tracking dashboard

Real-time crowd analytics

Matching algorithm optimization

WebSocket-based chat system

Deployment to cloud (Render / Railway)

👤 Author

Bala Vardhan Utla
B.Tech CSE
Aspiring Full Stack Developer

📌 Note

This project is currently under active development.