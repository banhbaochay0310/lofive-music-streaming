# 🎵 Lofive - Music Streaming Platform

> A full-stack music streaming web application with real-time social features, built to deliver seamless music listening experience with friends activity tracking and instant messaging.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.18-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 About The Project

**Lofive** is a modern music streaming platform that allows users to discover, play, and share their favorite music. Built with a focus on **social interaction**, users can see what their friends are listening to in real-time, send messages, and manage their personal music libraries.

This project was developed as a **personal portfolio piece** to demonstrate full-stack development capabilities, with a strong emphasis on **backend architecture**, **RESTful API design**, and **real-time features** using WebSockets.

---

## ✨ Core Features

### 🎧 Music Streaming
- ✅ **Audio Player** with play, pause, skip, queue management
- 🎵 **Browse Music** by songs, albums, and artists
- 💖 **Like System** - Save favorite songs to your library
- 📱 **Responsive UI** - Works seamlessly on desktop and mobile

### 👥 Social & Real-time Features
- 🟢 **Friends Activity Feed** - See what friends are listening to in real-time
- 💬 **Instant Messaging** - Chat with other users
- 📡 **Live Status Updates** - Online/offline indicators via WebSocket
- 🎶 **Activity Broadcasting** - Share your currently playing track

### ⚙️ Admin Dashboard
- 📤 **Upload Songs & Albums** directly to Cloudinary CDN
- 📊 **Statistics Dashboard** - Track users, songs, albums, and artists
- 🗑️ **Content Management** - Create, update, delete music content
- 🌱 **Database Seeding** - Populate database with sample data

### 🔐 Security
- 🔒 **Authentication** powered by Clerk (OAuth support)
- 🛡️ **Protected Routes** with middleware-based authorization
- 👤 **Role-Based Access Control** (User/Admin roles)

---

## 🏗️ Tech Stack & Architecture

### **Backend** (My Focus Area 🎯)

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework for building RESTful APIs |
| **MongoDB** | NoSQL database for flexible data modeling |
| **Mongoose** | ODM for schema validation and relationships |
| **Socket.IO** | Real-time bidirectional event-based communication |
| **Clerk Express** | Authentication middleware with OAuth |
| **Cloudinary SDK** | Cloud storage for audio files and images |
| **express-fileupload** | Multipart form data handling |
| **node-cron** | Task scheduling for automated cleanup |

### **Frontend**

| Technology | Purpose |
|-----------|---------|
| **React 18** + **TypeScript** | UI library with type safety |
| **Zustand** | Lightweight state management |
| **Tailwind CSS** + **Radix UI** | Styling and accessible components |
| **React Router v6** | Client-side routing |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP client with retry logic |

### **Deployment & Tools**

- **Vite** - Frontend build tool
- **Nodemon** - Development auto-reload
- **ESLint** + **TypeScript ESLint** - Code quality

---

## 🎯 Backend Architecture Highlights

### **RESTful API Design**

I designed and implemented **7 modular API endpoints** following REST principles:

```
📁 backend/src/routes/
├── auth.route.js         → User authentication & registration
├── user.route.js         → User profile management
├── song.route.js         → Song browsing & retrieval
├── album.route.js        → Album management
├── liked-song.route.js   → User's liked songs
├── admin.route.js        → Admin content management (Protected)
└── stat.route.js         → Statistics & analytics
```

**Key API Endpoints:**
```javascript
GET    /api/songs              // Fetch all songs
GET    /api/albums/:id         // Get album details
POST   /api/admin/songs        // Upload new song (Admin only)
DELETE /api/admin/songs/:id    // Delete song (Admin only)
GET    /api/stats              // Dashboard statistics
POST   /api/liked-songs/:id    // Like a song
GET    /api/users              // Get all users for chat
```

### **Database Schema Design**

Implemented **5 MongoDB collections** with proper relationships and indexing:

```javascript
// Song Model - Core music entity
{
  title: String,
  artist: String,
  audioUrl: String,      // Cloudinary URL
  imageUrl: String,      // Album artwork
  duration: Number,
  albumId: ObjectId      // Reference to Album
}

// Liked Song Model - Many-to-many relationship
{
  userId: String,        // Clerk user ID
  songId: ObjectId,      // Reference to Song
  // Composite unique index (userId + songId)
}
```

**Challenges Solved:**
- ✅ Prevented duplicate likes with **composite unique index**
- ✅ Optimized queries using **MongoDB aggregation pipeline** for stats
- ✅ Implemented **cascading deletes** when removing albums

### **File Upload & Cloud Storage**

Built a robust file upload system integrated with Cloudinary:

```javascript
// Features:
✓ Multipart form data parsing
✓ Temp file management with automatic cleanup
✓ CDN upload with error handling
✓ 10MB file size limit validation
✓ Daily cron job to clean temp directory
```

### **Real-time Communication with WebSocket**

Implemented Socket.IO server for real-time features:

```javascript
// Event-driven architecture:
✓ User connection/disconnection tracking
✓ Online status broadcasting
✓ Activity updates (currently playing song)
✓ Direct messaging between users
✓ Room-based event targeting
```

**Data Structures Used:**
- `Map<userId, socketId>` - Track connected users
- `Map<userId, activity>` - Cache user activities

### **Authentication & Security**

- Integrated **Clerk middleware** for secure authentication
- Protected admin routes with role verification
- Configured **CORS** for cross-origin requests
- Environment variables for sensitive credentials
- Centralized error handling middleware

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### **Prerequisites**

- Node.js (v18 or higher)
- MongoDB (local or Atlas cloud)
- Clerk account (free tier available)
- Cloudinary account (free tier available)

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/banhbaochay0310/lofive-music-streaming.git
cd lofive-music-streaming
```

---

### **2️⃣ Backend Setup**

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/lofive
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lofive

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin User ID (Get from Clerk Dashboard)
ADMIN_ID=user_xxxxxxxxxxxxxx
```

#### Seed Database (Optional)

```bash
npm run seed:albums
npm run seed:songs
```

#### Start Backend Server

```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

---

### **3️⃣ Frontend Setup**

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Clerk Authentication (Frontend)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# API Base URL (for production)
VITE_API_BASE_URL=http://localhost:5000
```

#### Start Frontend Development Server

```bash
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

### **4️⃣ Access the Application**

1. Open browser: `http://localhost:3000`
2. Click **Sign In** (Clerk authentication)
3. Browse music, play songs, and chat with friends!

**Admin Access:**
- Add your Clerk User ID to `ADMIN_ID` in backend `.env`
- Navigate to `http://localhost:3000/admin`

---

## 📂 Project Structure

```
lofive-music-streaming/
├── backend/
│   ├── src/
│   │   ├── index.js              # Entry point, server setup
│   │   ├── controller/           # Business logic for each route
│   │   │   ├── auth.controller.js
│   │   │   ├── song.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── ...
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── song.model.js
│   │   │   ├── album.model.js
│   │   │   └── ...
│   │   ├── routes/               # API route definitions
│   │   ├── lib/                  # Utilities (DB, Socket, Cloudinary)
│   │   ├── middleware/           # Auth middleware
│   │   └── seeds/                # Database seeding scripts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── pages/                # Route pages
│   │   ├── components/           # Reusable UI components
│   │   ├── layout/               # Layout components (Sidebar, Player)
│   │   ├── stores/               # Zustand state management
│   │   └── lib/                  # Utils (Axios, helpers)
│   └── package.json
└── README.md
```

---

## 🛠️ Available Scripts

### Backend

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed:albums  # Populate database with sample albums
npm run seed:songs   # Populate database with sample songs
```

### Frontend

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🔍 API Documentation

### Authentication Endpoints

```http
POST /api/auth/callback
# Body: { id, firstName, lastName, imageUrl }
# Response: { success: true }
```

### Song Endpoints

```http
GET /api/songs
# Response: Array of all songs

GET /api/songs/featured
# Response: Array of featured songs

GET /api/songs/made-for-you
# Response: Personalized recommendations

GET /api/songs/trending
# Response: Trending songs
```

### Admin Endpoints (Protected)

```http
POST /api/admin/songs
# Headers: Authorization
# Body: FormData (audioFile, imageFile, title, artist, duration, albumId)
# Response: Created song object

DELETE /api/admin/songs/:id
# Headers: Authorization
# Response: { message: "Song deleted successfully" }

POST /api/admin/albums
# Headers: Authorization
# Body: FormData (imageFile, title, artist, releaseYear)
# Response: Created album object
```

---

## 🧪 Testing the API

You can test the API using **Postman** or **curl**:

### Example: Get All Songs

```bash
curl http://localhost:5000/api/songs
```

### Example: Get Statistics

```bash
curl http://localhost:5000/api/stats
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- ⚠️ No pagination for large song libraries
- ⚠️ Limited search/filter functionality
- ⚠️ No unit tests coverage

### Planned Features
- 🔜 Add Jest/Mocha unit tests
- 🔜 Implement Redis caching for frequently accessed data
- 🔜 Add rate limiting to prevent API abuse
- 🔜 Support playlist creation by users
- 🔜 Implement recommendation algorithm
- 🔜 Add Swagger/OpenAPI documentation

---

## 👨‍💻 Author

**[Hoang]**

- 🌐 GitHub: [@banhbaochay0310](https://github.com/banhbaochay0310)
- 📧 Email: darwinisme0310@gmail.com

---

## 🙏 Acknowledgments

- [Clerk](https://clerk.com/) - Authentication infrastructure
- [Cloudinary](https://cloudinary.com/) - Media asset management
- [MongoDB](https://www.mongodb.com/) - Database platform
- [Socket.IO](https://socket.io/) - Real-time engine
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives

---