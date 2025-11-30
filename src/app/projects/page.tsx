'use client';

import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Global Education Platform',
      description: 'Digital platform connecting students worldwide for collaborative learning and cultural exchange',
      progress: 75,
      status: 'active',
      team: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'],
      startDate: '2024-01-01',
      deadline: '2024-02-15',
      budget: '$15,000'
    },
    {
      id: 2,
      name: 'Citizen Engagement App',
      description: 'Mobile app for civic participation, community projects, and sustainable development initiatives',
      progress: 40,
      status: 'active',
      team: ['Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Chen', 'Ivy Taylor', 'Jack Roberts'],
      startDate: '2024-01-10',
      deadline: '2024-03-30',
      budget: '$25,000'
    },
    {
      id: 3,
      name: 'Database Migration',
      description: 'Migration from legacy database to modern cloud infrastructure',
      progress: 90,
      status: 'review',
      team: ['Kevin Wang', 'Linda Adams', 'Mike Thompson'],
      startDate: '2023-12-01',
      deadline: '2024-01-20',
      budget: '$8,000'
    },
    {
      id: 4,
      name: 'Youth Leadership Program',
      description: 'International program developing next generation of global citizens and change-makers',
      progress: 20,
      status: 'planning',
      team: ['Nancy Garcia', 'Oscar Martinez'],
      startDate: '2024-01-15',
      deadline: '2024-02-28',
      budget: '$5,000'
    }
  ]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Initialize localStorage with default projects
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, []);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    deadline: '',
    budget: ''
  });

  const handleEditClick = (project: any) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      budget: project.budget
    });
    setShowNewProjectModal(true);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.description) {
      let updatedProjects;

      if (editingProject) {
        // Update existing project
        updatedProjects = projects.map(p =>
          p.id === editingProject.id
            ? { ...p, ...newProject }
            : p
        );
      } else {
        // Create new project
        const project = {
          id: projects.length + 1,
          name: newProject.name,
          description: newProject.description,
          progress: 0,
          status: 'planning' as const,
          team: [],
          startDate: new Date().toISOString().split('T')[0],
          deadline: newProject.deadline,
          budget: newProject.budget
        };
        updatedProjects = [...projects, project];
      }

      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      setNewProject({ name: '', description: '', deadline: '', budget: '' });
      setEditingProject(null);
      setShowNewProjectModal(false);
    }
  };

  return (
    <Layout currentPage="projects">

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-800 mt-2">Manage all your projects in one place</p>
          </div>
          <Link
            href="/setup"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${project.status === 'active' ? 'bg-green-100 text-green-900' :
                    project.status === 'review' ? 'bg-yellow-100 text-yellow-900' :
                      'bg-blue-100 text-blue-900'
                    }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-900 mb-4 text-sm">{project.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900">Progress</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Team</span>
                    <span className="font-medium text-gray-900">{project.team.length} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Deadline</span>
                    <span className="font-medium text-gray-900">{project.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900">Budget</span>
                    <span className="font-medium text-gray-900">{project.budget}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleEditClick(project)}
                      className="flex-1 bg-gray-100 text-gray-900 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <form onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      rows={3}
                      placeholder="Enter project description"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="text"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., $10,000"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProjectModal(false);
                      setEditingProject(null);
                      setNewProject({ name: '', description: '', deadline: '', budget: '' });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
