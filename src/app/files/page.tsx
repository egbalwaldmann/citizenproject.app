'use client';

import Layout from '../../components/Layout';
import { useState } from 'react';

export default function Files() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const files = [
    {
      id: 1,
      name: 'Project_Charter.pdf',
      size: '2.4 MB',
      type: 'PDF',
      category: 'documentation',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-01-15',
      icon: '📄'
    },
    {
      id: 2,
      name: 'UI_Mockups.figma',
      size: '15.2 MB',
      type: 'Figma',
      category: 'design',
      uploadedBy: 'Carol Davis',
      uploadDate: '2024-01-14',
      icon: '🎨'
    },
    {
      id: 3,
      name: 'Database_Schema.sql',
      size: '156 KB',
      type: 'SQL',
      category: 'technical',
      uploadedBy: 'Bob Smith',
      uploadDate: '2024-01-13',
      icon: '🗄️'
    },
    {
      id: 4,
      name: 'User_Research_Report.docx',
      size: '8.7 MB',
      type: 'Word',
      category: 'documentation',
      uploadedBy: 'David Wilson',
      uploadDate: '2024-01-12',
      icon: '📊'
    },
    {
      id: 5,
      name: 'Team_Photo.jpg',
      size: '3.2 MB',
      type: 'Image',
      category: 'media',
      uploadedBy: 'Eva Brown',
      uploadDate: '2024-01-11',
      icon: '🖼️'
    },
    {
      id: 6,
      name: 'API_Documentation.md',
      size: '45 KB',
      type: 'Markdown',
      category: 'technical',
      uploadedBy: 'Frank Miller',
      uploadDate: '2024-01-10',
      icon: '📋'
    }
  ];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Files', count: files.length },
    { value: 'documentation', label: 'Documentation', count: files.filter(f => f.category === 'documentation').length },
    { value: 'design', label: 'Design', count: files.filter(f => f.category === 'design').length },
    { value: 'technical', label: 'Technical', count: files.filter(f => f.category === 'technical').length },
    { value: 'media', label: 'Media', count: files.filter(f => f.category === 'media').length }
  ];

  return (
    <Layout currentPage="files">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-800 mt-2">Upload, organize, and share project files</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📁</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💾</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">35.1 MB</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🎨</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Design Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.filter(f => f.category === 'design').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{files.filter(f => f.category === 'documentation').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              + Upload
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{file.icon}</div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">{file.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-800 mb-4">
                <div className="flex justify-between">
                  <span>Size</span>
                  <span className="font-medium">{file.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type</span>
                  <span className="font-medium">{file.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded by</span>
                  <span className="font-medium">{file.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium">{file.uploadDate}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Download
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-800">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
