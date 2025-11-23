import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = '' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">CitizenProject</Link>
              <span className="ml-2 text-sm text-gray-500">citizenproject.app</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'dashboard' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/projects" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'projects' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Projects
              </Link>
              <Link 
                href="/tasks" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'tasks' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Tasks
              </Link>
              <Link 
                href="/team" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'team' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Team
              </Link>
              <Link 
                href="/files" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'files' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Files
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {children}
    </div>
  );
}