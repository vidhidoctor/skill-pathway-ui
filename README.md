# LearnHub - Mini Course Enrollment Platform

A modern, production-ready course enrollment platform built with React + Vite.

## Features

- 🔐 JWT Authentication (Login/Signup)
- 🎓 Course browsing with search & filters
- 💳 Checkout and payment flow
- 📊 User dashboard with enrollments
- 🛠️ Admin panel for course & user management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start dev server:
```bash
npm run dev
```

## Tech Stack

React 18 • TypeScript • Vite • React Router • Axios • Tailwind CSS • Shadcn UI • Context API

## Routes

- `/` - Home (course listing)
- `/login` - Login page
- `/signup` - Registration
- `/course/:id` - Course details
- `/dashboard` - User dashboard (protected)
- `/admin/dashboard` - Admin panel (admin only)
- `/checkout/:id` - Payment page (protected)

## Deployment

```bash
npm run build
```

Deploy the `dist` folder to Vercel/Netlify.
