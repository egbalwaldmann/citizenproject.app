# Development Guide

This file provides guidance for developers working with code in this repository.

## Project Overview

CitizenProject is a project management platform built with Next.js 16, designed for educational institutions, NGOs, and public sector organizations. The platform emphasizes GDPR compliance, open source principles, and accessibility for non-technical project managers.

**Live Platform:** https://citizenproject.app

## Tech Stack

- **Framework:** Next.js 16.0.3 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.x with strict mode enabled
- **Styling:** Tailwind CSS 4
- **Path Alias:** `@/*` maps to `./src/*`

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Application Structure

This is a **Next.js App Router** application with the following structure:

```
src/
├── app/                      # App Router pages
│   ├── dashboard/           # Dashboard overview with statistics
│   ├── projects/            # Project management
│   ├── tasks/               # Task tracking and assignment
│   ├── team/                # Team member management
│   ├── files/               # File management
│   ├── intern/              # Intern information page
│   ├── simple/              # Simple demo page
│   ├── test/                # Test/development page
│   ├── layout.tsx           # Root layout with fonts and metadata
│   ├── page.tsx             # Landing page (German content)
│   └── globals.css          # Global styles
└── components/
    └── Layout.tsx           # Shared navigation layout
```

### Key Architectural Patterns

1. **Client Components with Local State:**
   - All feature pages (dashboard, projects, tasks, team) use `'use client'` directive
   - State management via React `useState` hooks
   - Mock data is defined directly in components (no external API yet)

2. **Layout Component Pattern:**
   - `src/components/Layout.tsx` provides consistent navigation across pages
   - Accepts `currentPage` prop to highlight active navigation item
   - Includes GitHub repository link in navigation

3. **Modal-Based Forms:**
   - Create actions (new project, task, team member) use modal overlays
   - Forms are inline within page components, not separate components

4. **Font Configuration:**
   - Uses Next.js Google Fonts (Geist and Geist Mono)
   - Configured in root layout with CSS variables

## Important Details

### Language & Content
- **Landing page** (`/page.tsx`) is in **German** - this is intentional for the target audience (German universities, NGOs, public institutions)
- Feature pages (dashboard, projects, tasks, team) are in **English**

### Data Patterns
- All data is currently **mock data** stored in component state
- Common data structures:
  - Projects: id, title, description, status (planning/active/review), progress (0-100), team, budget, dueDate
  - Tasks: id, title, description, project, assignee, priority (high/medium/low), status (todo/in-progress/review/completed), dueDate, tags
  - Team Members: id, name, role, skills, status, projects, avatar (emoji)

### Styling Conventions
- Primary color: indigo (indigo-600, indigo-50, etc.)
- Uses Tailwind utility classes exclusively
- Responsive breakpoints: sm, md, lg
- Emoji-based icons throughout the UI

### Navigation Structure
The app has consistent navigation across these main sections:
- Dashboard → `/dashboard`
- Projects → `/projects`
- Tasks → `/tasks`
- Team → `/team`
- Files → `/files`
- GitHub link → `https://github.com/egbalwaldmann/citizenproject.app`

## Path Alias Usage

Always use the `@/` path alias when importing from the src directory:

```typescript
// Correct
import Layout from '@/components/Layout';

// Avoid (but still works)
import Layout from '../../components/Layout';
```

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (automatic runtime)
- Module resolution: bundler

## Future Development Notes

- Backend integration planned (currently frontend-only with mock data)
- Authentication system to be implemented
- File upload functionality in `/files` page
- Real-time updates and notifications planned
- Database integration pending (currently stateless)

## Deployment

- Primary deployment target: AWS Amplify
- See `deploy.md` for detailed deployment instructions
- Domain: citizenproject.app

## Code Quality

- ESLint configured with Next.js rules
- TypeScript strict mode enforced
- No test suite currently implemented
