# TaskFlow - Simple Task Management System

A clean and simple task management application built with Next.js, TypeScript, and MongoDB.

## Features

- **User Authentication**: Simple login system with session management
- **User Management**: Create and manage users with role-based permissions
- **Task Management**: Assign, complete, and delete tasks for users
- **Role-based Access**: Different permission levels based on user roles
- **Clean UI**: Simple and intuitive interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Session-based with cookies

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/           # API endpoints
│   ├── dashboard/     # Main dashboard page
│   ├── login/         # Login page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
└── db/
    ├── index.ts       # Database connection
    └── schema.ts      # Database schemas
```

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/auth` - Check authentication status
- `GET /api/users` - Get all users
- `POST /api/create-user` - Create new user
- `DELETE /api/delete-user` - Delete user
- `GET /api/get-roles` - Get all roles
- `POST /api/assign-task` - Assign task to user
- `POST /api/complete-task` - Mark task as complete
- `DELETE /api/delete-task` - Delete task

## Database Schema

### User
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, required)
- `role` (ObjectId, reference to Role)
- `tasks` (Array of task objects)

### Role
- `name` (String, unique, required)
- `rank` (Number, required)

### Task
- `name` (String, required)
- `isCompleted` (Boolean, default: false)

## Clean Code Principles

This codebase follows clean code principles:
- **Simple and readable**: Removed unnecessary complexity
- **Consistent naming**: Clear and descriptive variable/function names
- **Proper error handling**: Comprehensive error handling throughout
- **Type safety**: Full TypeScript implementation
- **Minimal dependencies**: Only essential packages included
