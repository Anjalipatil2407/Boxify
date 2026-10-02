# 📦 Boxify

Boxify is a full-stack subscription box web application that allows users to explore subscription plans, customize their boxes, manage subscriptions, and track shipments.

This is my first full-stack web application built using React, Node.js, Express.js, MongoDB, Firebase, JWT, and Socket.IO.

## 🌐 Live Demo

https://boxify-i7jt.onrender.com

## ✨ Features

- User registration and login
- JWT authentication
- Firebase authentication integration
- Browse subscription plans
- Subscribe to a Boxify plan
- Customize subscription boxes
- Manage subscriptions
- Pause or cancel subscriptions
- Track shipments
- Real-time shipment updates using Socket.IO
- Firebase notification integration
- Admin shipment management

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT
- Firebase Authentication

### Real-Time Communication
- Socket.IO

### Deployment
- Render

## 📁 Project Structure

Boxify/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md

## 🔐 Security

Sensitive information such as MongoDB credentials, JWT secrets, and Firebase service credentials is stored using environment variables and is not committed to GitHub.

## 🚀 Running Locally

Clone the repository:

git clone https://github.com/Anjalipatil2407/Boxify.git

Install backend dependencies:

cd Boxify/backend
npm install
npm start

Open another terminal and install frontend dependencies:

cd Boxify/frontend
npm install
npm run dev

## 💡 What I Learned

Building Boxify helped me understand how a complete full-stack application works, including:

- Connecting React with backend APIs
- Building REST APIs using Express.js
- Storing and retrieving data using MongoDB
- Implementing authentication
- Using middleware and controllers
- Working with environment variables
- Implementing real-time communication using Socket.IO
- Integrating Firebase
- Testing APIs
- Deploying frontend and backend applications

## 👩‍💻 Developer

Developed by Anjali Patil
