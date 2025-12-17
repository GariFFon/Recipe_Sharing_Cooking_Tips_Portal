# Recipe Sharing & Cooking Tips Portal

Welcome to the Recipe Sharing & Cooking Tips Portal!

## Contributors
- Chirag Yadav
- Yash Patil
- Gourav Dash

A MERN stack application for sharing recipes and cooking tips, featuring a minimalist aesthetic and smart kitchen tools.

## 🚀 Getting Started

Follow these steps to set up the project locally after pulling the repository.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas URI)

### 1. Installation

Install dependencies for both backend and frontend.

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/recipe_portal
```

### 3. Seed Database (Optional)

Populate the database with sample recipes:

```bash
cd backend
node seed.js
```

### 4. Running the App

You need to run both the backend and frontend servers.

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.
