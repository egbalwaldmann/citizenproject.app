'use client';

import Layout from '../../components/Layout';
import { useState } from 'react';

export default function Team() {
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      role: 'Project Manager',
      email: 'alice.johnson@citizenproject.app',
      phone: '+49 123 4567890',
      avatar: '👩‍💼',
      status: 'active',
      projects: ['Website Redesign', 'Mobile App Development'],
      skills: ['Project Management', 'Agile', 'Scrum'],
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Bob Smith',
      role: 'Full Stack Developer',
      email: 'bob.smith@citizenproject.app',
      phone: '+49 123 4567891',
      avatar: '👨‍💻',
      status: 'active',
      projects: ['Website Redesign', 'Database Migration'],
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      joinDate: '2023-02-01'
    },
    {
      id: 3,
      name: 'Carol Davis',
      role: 'UX Designer',
      email: 'carol.davis@citizenproject.app',
      phone: '+49 123 4567892',
      avatar: '👩‍🎨',
      status: 'active',
      projects: ['Website Redesign', 'User Research Study'],
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
      joinDate: '2023-01-20'
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Data Analyst',
      email: 'david.wilson@citizenproject.app',
      phone: '+49 123 4567893',
      avatar: '👨‍📊',
      status: 'active',
      projects: ['User Research Study', 'Database Migration'],
      skills: ['Data Analysis', 'SQL', 'Python', 'Statistics'],
      joinDate: '2023-03-10'
    },
    {
      id: 5,
      name: 'Eva Brown',
      role: 'DevOps Engineer',
      email: 'eva.brown@citizenproject.app',
      phone: '+49 123 4567894',
      avatar: '👩‍🔧',
      status: 'active',
      projects: ['Website Redesign', 'Mobile App Development'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      joinDate: '2023-02-15'
    },
    {
      id: 6,
      name: 'Frank Miller',
      role: 'Mobile Developer',
      email: 'frank.miller@citizenproject.app',
      phone: '+49 123 4567895',
      avatar: '👨‍📱',
      status: 'vacation',
      projects: ['Mobile App Development'],
      skills: ['React Native', 'iOS', 'Android', 'Swift', 'Kotlin'],
      joinDate: '2023-04-01'
    }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: '',
    message: ''
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInvite.email && newInvite.role) {
      // In a real app, this would send an invitation email
      console.log('Sending invite:', newInvite);
      setNewInvite({ email: '', role: '', message: '' });
      setShowInviteModal(false);
      // Show success message
      alert('Invitation sent successfully!');
    }
  };

  return (
    <Layout currentPage="team">

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-800 mt-2">Manage your team and collaborate effectively</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            + Invite Member
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-yellow-500 mr-4">🏖️</div>
              <div>
                <p className="text-sm font-medium text-gray-900">On Vacation</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'vacation').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">💼</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Roles</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(teamMembers.map(m => m.role)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{member.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-900">{member.role}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'vacation' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-900'
                        }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-900 mb-1">📧 {member.email}</p>
                    <p className="text-sm text-gray-900 mb-1">📞 {member.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Current Projects</p>
                    <div className="space-y-1">
                      {member.projects.map((project, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{member.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-700">Joined {member.joinDate}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Message
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invite Team Member</h2>
              <form onSubmit={handleSendInvite}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newInvite.email}
                      onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      placeholder="colleague@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newInvite.role}
                      onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="QA Engineer">QA Engineer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                    <textarea
                      value={newInvite.message}
                      onChange={(e) => setNewInvite({ ...newInvite, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                      rows={3}
                      placeholder="Welcome to our team..."
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
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
