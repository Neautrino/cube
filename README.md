# Cube - Simple Task Management System

A clean and modern task management application built with Next.js, TypeScript, and MongoDB. Cube provides a simple yet powerful way to manage tasks, users, and role-based permissions.

![Cube Dashboard](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Cube+Dashboard)

## ✨ Features

- **🔐 User Authentication**: Secure login system with session management
- **👥 User Management**: Create, manage, and delete users with role-based permissions
- **📋 Task Management**: Assign, complete, and delete tasks for users
- **🎭 Role-based Access Control**: Different permission levels based on user roles
- **🎨 Modern UI**: Clean and intuitive interface built with Tailwind CSS
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔒 Type Safety**: Full TypeScript implementation for better development experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based with secure cookies
- **Password Hashing**: bcryptjs for secure password storage
- **Development**: ESLint, Turbopack for fast development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd cube
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```
   
   For local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cube
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. The application will automatically create default roles (Admin, Manager, User) on first run
2. Create your first admin user through the API or database
3. Log in and start managing tasks and users!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API endpoints
│   │   ├── auth.ts    # Authentication endpoints
│   │   ├── users.ts   # User management
│   │   ├── tasks.ts   # Task operations
│   │   └── roles.ts   # Role management
│   ├── dashboard/     # Main dashboard page
│   ├── login/         # Login page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── db/
│   ├── index.ts       # Database connection
│   └── schema.ts      # Database schemas
└── componets/         # Reusable components
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/auth` - Check authentication status

### User Management
- `GET /api/users` - Get all users
- `POST /api/create-user` - Create new user
- `DELETE /api/delete-user` - Delete user

### Task Management
- `POST /api/assign-task` - Assign task to user
- `POST /api/complete-task` - Mark task as complete
- `DELETE /api/delete-task` - Delete task

### Role Management
- `GET /api/get-roles` - Get all roles

## 🗄️ Database Schema

### User
```typescript
{
  name: string,           // Required
  email: string,          // Required, unique
  password: string,       // Required, hashed
  role: ObjectId,         // Reference to Role
  tasks: Task[]           // Array of task objects
}
```

### Role
```typescript
{
  name: string,           // Required, unique
  rank: number            // Required, determines permissions
}
```

### Task
```typescript
{
  name: string,           // Required
  isCompleted: boolean    // Default: false
}
```

## 🔐 Role-based Permissions

- **Admin (Rank: 3)**: Full access to all features
- **Manager (Rank: 2)**: Can manage users and tasks
- **User (Rank: 1)**: Can view and complete assigned tasks

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Development

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Code Quality

This project follows clean code principles:
- **Simple and readable**: Removed unnecessary complexity
- **Consistent naming**: Clear and descriptive variable/function names
- **Proper error handling**: Comprehensive error handling throughout
- **Type safety**: Full TypeScript implementation
- **Minimal dependencies**: Only essential packages included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Ensure all linting passes
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Made with ❤️ using modern web technologies**
