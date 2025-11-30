'use client';

import Layout from '../../components/Layout';
import { useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Update homepage design',
      description: 'Redesign the homepage with new branding and improved user experience',
      project: 'Website Redesign',
      assignee: 'Alice Johnson',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      createdDate: '2024-01-01',
      tags: ['design', 'frontend']
    },
    {
      id: 2,
      title: 'Implement user authentication',
      description: 'Set up secure login and registration system with JWT tokens',
      project: 'Mobile App Development',
      assignee: 'Bob Smith',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-18',
      createdDate: '2024-01-02',
      tags: ['backend', 'security']
    },
    {
      id: 3,
      title: 'Data backup verification',
      description: 'Verify all data has been properly backed up before migration',
      project: 'Database Migration',
      assignee: 'Carol Davis',
      priority: 'high',
      status: 'review',
      dueDate: '2024-01-12',
      createdDate: '2023-12-28',
      tags: ['database', 'backup']
    },
    {
      id: 4,
      title: 'Schedule user interviews',
      description: 'Contact participants and schedule 1-on-1 user interviews',
      project: 'User Research Study',
      assignee: 'David Wilson',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-01-20',
      createdDate: '2024-01-03',
      tags: ['research', 'interviews']
    },
    {
      id: 5,
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      project: 'Website Redesign',
      assignee: 'Eva Brown',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-10',
      createdDate: '2023-12-20',
      tags: ['devops', 'automation']
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.project) {
      const task = {
        id: tasks.length + 1,
        title: newTask.title,
        description: newTask.description,
        project: newTask.project,
        assignee: newTask.assignee,
        priority: newTask.priority as 'low' | 'medium' | 'high',
        status: 'todo' as const,
        dueDate: newTask.dueDate,
        createdDate: new Date().toISOString().split('T')[0],
        tags: []
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        project: '',
        assignee: '',
        priority: 'medium',
        dueDate: ''
      });
      setShowNewTaskModal(false);
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
  };

  return (
    <Layout currentPage="tasks">

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-800 mt-2">Manage and track all project tasks</p>
          </div>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Tasks', count: tasks.length },
                { key: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
                { key: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
                { key: 'review', label: 'Review', count: tasks.filter(t => t.status === 'review').length },
                { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${filter === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'review' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-800 mb-3">{task.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-800">
                      <span>📊 {task.project}</span>
                      <span>👤 {task.assignee}</span>
                      <span>📅 Due: {task.dueDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-800">
              {filter === 'all' ? 'Create your first task to get started' : `No tasks in "${filter.replace('-', ' ')}" status`}
            </p>
          </div>
        )}

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      rows={3}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                      <select
                        value={newTask.project}
                        onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                        required
                      >
                        <option value="">Select Project</option>
                        <option value="Website Redesign">Website Redesign</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Database Migration">Database Migration</option>
                        <option value="User Research Study">User Research Study</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                      <input
                        type="text"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                        placeholder="Assign to team member"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTaskModal(false)}
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
