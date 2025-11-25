'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Dashboard() {
  const [projects] = useState([
    { id: 1, name: 'Website Redesign', progress: 75, status: 'active', team: 4 },
    { id: 2, name: 'Mobile App Development', progress: 40, status: 'active', team: 6 },
    { id: 3, name: 'Database Migration', progress: 90, status: 'review', team: 3 },
    { id: 4, name: 'User Research Study', progress: 20, status: 'planning', team: 2 },
  ]);

  const [recentTasks] = useState([
    { id: 1, title: 'Update homepage design', project: 'Website Redesign', priority: 'high', dueDate: '2024-01-15' },
    { id: 2, title: 'Implement user authentication', project: 'Mobile App Development', priority: 'medium', dueDate: '2024-01-18' },
    { id: 3, title: 'Data backup verification', project: 'Database Migration', priority: 'high', dueDate: '2024-01-12' },
    { id: 4, title: 'Schedule user interviews', project: 'User Research Study', priority: 'low', dueDate: '2024-01-20' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">CitizenProject.App</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </Link>
              <Link href="/tasks" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Tasks
              </Link>
              <Link href="/team" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Team
              </Link>
              <Link href="/files" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Files
              </Link>
              <a 
                href="https://github.com/egbalwaldmann/citizenproject.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-md transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-800 mt-2">Welcome back! Here's what's happening with your projects.</p>
        </div>


        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-yellow-500 mr-4">⏰</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-800">{project.progress}%</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">👥 {project.team} team members</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link 
                  href="/projects" 
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  View all projects →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-800">{task.project}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link 
                  href="/tasks" 
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  View all tasks →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
