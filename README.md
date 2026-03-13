# eKYC Verification Web Application

A full-stack eKYC (Electronic Know Your Customer) verification system built with the MERN stack.

## Features

### User
- Register & Login with JWT authentication
- Password recovery via security questions
- Submit KYC application with Aadhaar & PAN details
- Upload document images (stored on Cloudinary)
- Track application status (Pending / Approved / Rejected)
- Resubmit rejected applications with updated details
- Up to 3 fresh KYC submissions per user

### Admin
- View all KYC applications with search & filters
- Approve or reject applications with comments
- Change application status multiple times
- Delete applications
- Dashboard analytics (total, pending, approved, rejected)

## Tech Stack

**Frontend:** React, Tailwind CSS, Axios, React Router  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**Storage:** Cloudinary (document images), Multer  

## Project Structure

ekyc-app/
├── server/        # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── client/        # React frontend
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repo
   
git clone https://github.com/YOUR_USERNAME/ekyc-verification-app.git
cd ekyc-verification-app

3. Install backend dependencies

cd server
npm install

4. Install frontend dependencies
   
cd ../client
npm install

6. Set up environment variables

Create `server/.env`:

PORT=8000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Create `client/.env`:

VITE_API_URL=http://localhost:8000

5. Run the app

# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

Open [http://localhost:5173](http://localhost:5173)

## Demo Credentials

| Role  |     Email      |     Password      |
|-------|----------------|-------------------|
| Admin | admin@ekyc.com |     admin123      |
| User  |       Register a new account       |  

---

## Step 3 — Make sure .gitignore is correct

Open `.gitignore` in your root `ekyc-app/` folder and make sure it contains:

node_modules/
.env
dist/
.DS_Store
