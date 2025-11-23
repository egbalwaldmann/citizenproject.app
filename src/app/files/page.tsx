'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Files() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Project_Charter_Global_Education.pdf',
      size: '2.4 MB',
      type: 'PDF',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-01-15',
      project: 'Global Education Platform',
      category: 'documentation',
      tags: ['charter', 'planning']
    },
    {
      id: 2,
      name: 'Citizen_App_Mockups.sketch',
      size: '15.7 MB',
      type: 'Sketch',
      uploadedBy: 'Carol Davis',
      uploadDate: '2024-01-14',
      project: 'Citizen Engagement App',
      category: 'design',
      tags: ['mockup', 'ui', 'design']
    },
    {
      id: 3,
      name: 'Database_Migration_Plan.docx',
      size: '847 KB',
      type: 'Word',
      uploadedBy: 'Bob Smith',
      uploadDate: '2024-01-12',
      project: 'Database Migration',
      category: 'technical',
      tags: ['migration', 'database', 'plan']
    },
    {
      id: 4,
      name: 'Youth_Leadership_Survey_Results.xlsx',
      size: '3.2 MB',
      type: 'Excel',
      uploadedBy: 'David Wilson',
      uploadDate: '2024-01-10',
      project: 'Youth Leadership Program',
      category: 'data',
      tags: ['survey', 'research', 'data']
    },
    {
      id: 5,
      name: 'Team_Photo_Workshop_2024.jpg',
      size: '4.1 MB',
      type: 'Image',
      uploadedBy: 'Eva Brown',
      uploadDate: '2024-01-08',
      project: 'General',
      category: 'media',
      tags: ['photo', 'team', 'workshop']
    },
    {
      id: 6,
      name: 'Meeting_Recording_Jan_2024.mp4',
      size: '124 MB',
      type: 'Video',
      uploadedBy: 'Frank Miller',
      uploadDate: '2024-01-05',
      project: 'General',
      category: 'media',
      tags: ['meeting', 'recording', 'video']
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.category === filter;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'word': case 'docx': return '📝';
      case 'excel': case 'xlsx': return '📊';
      case 'image': case 'jpg': case 'png': return '🖼️';
      case 'video': case 'mp4': return '🎥';
      case 'sketch': return '🎨';
      default: return '📎';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(droppedFiles);
      setShowUploadModal(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(selectedFiles);
      setShowUploadModal(true);
    }
  };

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
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
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
              <Link href="/files" className="text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md text-sm font-medium">
                Files
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
            <p className="text-gray-600 mt-2">Upload, organize, and share project files</p>
          </div>
          <div className="flex space-x-3">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              + Upload Files
            </label>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">📁</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">💾</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">152 MB</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">🎨</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Design Files</p>
                <p className="text-2xl font-bold text-gray-900">{files.filter(f => f.category === 'design').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-orange-500 mr-4">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{files.filter(f => f.category === 'documentation').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-6xl mb-4">📤</div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drag and drop files here
          </p>
          <p className="text-gray-600">
            Or click the upload button above to select files
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Files', count: files.length },
                { key: 'documentation', label: 'Documents', count: files.filter(f => f.category === 'documentation').length },
                { key: 'design', label: 'Design', count: files.filter(f => f.category === 'design').length },
                { key: 'technical', label: 'Technical', count: files.filter(f => f.category === 'technical').length },
                { key: 'data', label: 'Data', count: files.filter(f => f.category === 'data').length },
                { key: 'media', label: 'Media', count: files.filter(f => f.category === 'media').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
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

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getFileIcon(file.type)}</div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    file.category === 'documentation' ? 'bg-blue-100 text-blue-800' :
                    file.category === 'design' ? 'bg-purple-100 text-purple-800' :
                    file.category === 'technical' ? 'bg-green-100 text-green-800' :
                    file.category === 'data' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {file.type}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">{file.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Size</span>
                    <span className="font-medium">{file.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project</span>
                    <span className="font-medium text-xs">{file.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded by</span>
                    <span className="font-medium text-xs">{file.uploadedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium">{file.uploadDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{file.tags.length - 2}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Download
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Upload your first file to get started' : `No files in "${filter}" category`}
            </p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Files</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Selected Files:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="documentation">Documentation</option>
                    <option value="design">Design</option>
                    <option value="technical">Technical</option>
                    <option value="data">Data</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="General">General</option>
                    <option value="Global Education Platform">Global Education Platform</option>
                    <option value="Citizen Engagement App">Citizen Engagement App</option>
                    <option value="Database Migration">Database Migration</option>
                    <option value="Youth Leadership Program">Youth Leadership Program</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Upload Files
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}