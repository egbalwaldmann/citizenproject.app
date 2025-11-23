# CitizenProject - Global Collaboration Platform

A modern project management platform built with Next.js, empowering global citizenship through collaborative initiatives for educational institutions, NGOs, and citizen engagement worldwide.

**🌐 Live Platform:** https://citizenproject.app

## 🚀 Features

### Core Functionality
- **Dashboard Overview** - Real-time project and task statistics
- **Project Management** - Create, track, and manage projects with progress tracking
- **Task Management** - Comprehensive task tracking with priorities and status updates
- **Team Management** - Team member profiles, roles, and collaboration tools

### Design Principles
- 🔒 **GDPR Compliant** - Built with privacy in mind
- 🌱 **Open Source** - Transparent, community-driven development
- 🌍 **Global Citizenship Focus** - Promoting international collaboration and civic engagement
- 🎓 **Education Focus** - Tailored for universities and educational organizations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React useState hooks
- **Icons**: Emoji-based UI elements
- **Development**: ESLint, PostCSS

## 📋 Pages and Features

### Home Page (`/`)
- Hero section with feature highlights
- Navigation to main app sections
- Overview of key benefits for educational institutions

### Dashboard (`/dashboard`)
- Project overview with progress bars
- Recent tasks summary
- Key metrics and statistics
- Quick navigation to projects and tasks

### Projects (`/projects`)
- Project cards with status indicators
- Progress tracking and team information
- Create new projects with modal form
- Budget and deadline tracking

### Tasks (`/tasks`)
- Filterable task list (All, To Do, In Progress, Review, Completed)
- Task creation with priorities and assignments
- Status updates with dropdown selection
- Task categorization with tags

### Team (`/team`)
- Team member profiles with avatars
- Skills and project assignments
- Invite new members functionality
- Team statistics and status tracking

## 🚀 Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard overview
│   ├── projects/
│   │   └── page.tsx          # Global project management
│   ├── tasks/
│   │   └── page.tsx          # Collaborative task management
│   ├── team/
│   │   └── page.tsx          # International team management
│   ├── simple/
│   │   └── page.tsx          # Simple demo page
│   ├── test/
│   │   └── page.tsx          # Test page for development
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
└── components/
    └── Layout.tsx             # Shared layout component
```

## 🎯 Key Features Demonstrated

### Project Management
- Create and track multiple projects simultaneously
- Visual progress indicators
- Team assignment and budget tracking
- Status management (Planning, Active, Review)

### Task Management
- Comprehensive task filtering and categorization
- Priority levels (High, Medium, Low)
- Status workflow (To Do → In Progress → Review → Completed)
- Due date tracking and assignment management

### Team Collaboration
- Team member profiles with role definitions
- Skills tracking and project assignments
- Status indicators (Active, Vacation, etc.)
- Invitation system for new team members

### User Experience
- Clean, modern interface with consistent navigation
- Responsive design for all device types
- Modal-based forms for quick actions
- Real-time status updates

## 🔧 Customization

The application is built with modularity in mind:

- **Colors**: Easily customizable through Tailwind CSS configuration
- **Components**: Reusable React components with TypeScript
- **Data**: Mock data can be easily replaced with API calls
- **Features**: Modular page structure allows for easy feature addition

## 📈 Future Enhancements

This PoC demonstrates core functionality. Future versions could include:

- Real backend integration with databases
- User authentication and authorization
- File upload and document management
- Time tracking and reporting
- Advanced analytics and insights
- Integration with external tools (Git, Slack, etc.)
- Mobile app development

## 🤝 Contributing

This is a proof of concept for educational and demonstration purposes. Feel free to use this as a starting point for your own project management solutions.

## 📜 License

Open source - feel free to use and modify as needed for educational institutions and NGOs.
