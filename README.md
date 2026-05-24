# 📋 Task Management Workspace

A modern task management application built with **Vue 3** and **Ant Design Vue**. Manage your tasks efficiently with a beautiful dashboard, task list, and admin panel.

## 🚀 Tech Stack

- **Frontend:** Vue 3
- **UI Library:** Ant Design Vue 4
- **Router:** Vue Router 4
- **HTTP Client:** Axios
- **Build Tool:** Vue CLI 5

## 📸 Screenshots

### Dashboard Overview
The dashboard provides a comprehensive overview of all tasks with statistics, task distribution analysis, and active task summaries.

<img width="1892" alt="Dashboard Overview" src="screenshots/dashboard-overview.png" />

### Tasks Management
Full task management with search, filtering, status tracking (Ready, Pending, Completed, In Progress), and CRUD operations.

<img width="1892" alt="Tasks Management" src="screenshots/tasks-management.png" />

### Admin Dashboard
Admin panel for user management with role-based access control.

<img width="1892" alt="Admin Dashboard" src="screenshots/admin-dashboard.png" />

## ✨ Features

- 📊 **Dashboard** - Real-time task statistics and completion rates
- 📝 **Task Management** - Create, edit, delete, and search tasks
- 👥 **Admin Panel** - User management with role-based access
- 🔍 **Search & Filter** - Search tasks by title or description
- 📄 **Pagination** - Paginated lists for better performance
- 🎨 **Modern UI** - Clean and responsive design with Ant Design Vue

## 📦 Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Build for production
npm run build

# Lint files
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── DashboardComp.vue    # Dashboard with statistics
│   ├── TaskListComp.vue     # Task list with CRUD
│   └── AdminDashboard.vue   # Admin user management
├── service/             # API services
│   ├── TaskService.js       # Task API calls
│   └── AdminService.js      # Admin API calls
├── router/              # Vue Router configuration
├── App.vue              # Main application component
└── main.js              # Application entry point
```
 
