import React, { useState, useEffect } from 'react';
import { getChallenges, setChallenges, getCurrentUser } from '../../utils/localStorage';
import { apiGetChallenges, apiCreateChallenge, apiUpdateChallenge, apiDeleteChallenge } from '../../utils/api';

export const ManageChallenges = () => {
  const [challenges, setChallengesList] = useState([]);
  const [user, setUser] = useState(getCurrentUser());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const showToast = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(''), 3000);
  };

  const initialForm = {
    title: '',
    description: '',
    topic: 'Arrays',
    difficulty: 'Easy',
    points: 50,
    timeLimit: '1.0s',
    status: 'published',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    explanation: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const topics = [
    'All',
    'Arrays',
    'Strings',
    'Linked List',
    'Stack',
    'Queue',
    'Trees',
    'Searching',
    'Sorting',
    'Basic Programming'
  ];

  useEffect(() => {
    setUser(getCurrentUser());
    apiGetChallenges()
      .then(data => {
        setChallengesList(data);
        setChallenges(data);
      })
      .catch(() => {
        setChallengesList(getChallenges());
      });
  }, []);

  const handleOpenAddModal = () => {
    setEditingChallenge(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title || '',
      description: challenge.description || '',
      topic: challenge.topic || 'Arrays',
      difficulty: challenge.difficulty || 'Easy',
      points: challenge.points || 50,
      timeLimit: challenge.timeLimit || '1.0s',
      status: challenge.status || 'published',
      inputFormat: challenge.inputFormat || '',
      outputFormat: challenge.outputFormat || '',
      constraints: challenge.constraints || '',
      sampleInput: challenge.sampleInput || '',
      sampleOutput: challenge.sampleOutput || '',
      explanation: challenge.explanation || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveChallenge = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a challenge title.');
      return;
    }
    if (!formData.points || Number(formData.points) <= 0) {
      alert('Please enter valid points.');
      return;
    }
    if (!formData.difficulty) {
      alert('Please select a difficulty.');
      return;
    }

    const payload = {
      ...formData,
      points: Number(formData.points),
      createdBy: user?.name || 'CSE Faculty'
    };

    try {
      if (editingChallenge) {
        const updated = await apiUpdateChallenge(editingChallenge.id, payload);
        const all = getChallenges();
        const newAll = all.map(c => c.id === editingChallenge.id ? updated : c);
        setChallenges(newAll);
        setChallengesList(newAll);
        showToast('Challenge updated successfully.');
      } else {
        const created = await apiCreateChallenge(payload);
        const all = getChallenges();
        all.unshift(created);
        setChallenges(all);
        setChallengesList([created, ...challenges]);
        showToast('Challenge created successfully!');
      }
    } catch {
      // Fallback: localStorage only
      const all = getChallenges();
      if (editingChallenge) {
        const newAll = all.map(c =>
          c.id === editingChallenge.id
            ? { ...c, ...formData, points: Number(formData.points), updatedAt: new Date().toISOString().split('T')[0] }
            : c
        );
        setChallenges(newAll);
        setChallengesList(newAll);
        showToast('Challenge updated successfully.');
      } else {
        const newChall = {
          id: `chall_${Date.now()}`,
          ...formData,
          points: Number(formData.points),
          createdBy: user?.name || 'CSE Faculty',
          createdAt: new Date().toISOString().split('T')[0],
          acceptanceRate: '100%',
          starterCodes: {
            python: `import sys\n# Write solution here\nprint("Result")`,
            cpp: `#include <iostream>\nusing namespace std;\nint main() { return 0; }`,
            java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {}\n}`,
            c: `#include <stdio.h>\nint main() { return 0; }`
          },
          testCases: [{ id: 1, input: formData.sampleInput || '1', expectedOutput: formData.sampleOutput || '1', isHidden: false }]
        };
        all.unshift(newChall);
        setChallenges(all);
        setChallengesList(all);
        showToast('Challenge created successfully!');
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteChallenge(id);
    } catch {}
    const all = getChallenges();
    const filtered = all.filter(c => c.id !== id);
    setChallenges(filtered);
    setChallengesList(filtered);
    setDeleteConfirmId(null);
    showToast('Challenge deleted.');
  };

  const toggleStatus = async (challenge) => {
    const newStatus = challenge.status === 'published' ? 'draft' : 'published';
    try {
      await apiUpdateChallenge(challenge.id, { status: newStatus });
    } catch {}
    const all = getChallenges();
    const updated = all.map(c => c.id === challenge.id ? { ...c, status: newStatus } : c);
    setChallenges(updated);
    setChallengesList(updated);
    showToast(`Challenge set to ${newStatus === 'published' ? 'Published' : 'Draft'}.`);
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesTopic = selectedTopic === 'All' || c.topic === selectedTopic;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Manage Course Challenges
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, update, or publish coding challenges and test cases for students.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          + Add New Challenge
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackNotice && (
        <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded shadow-xs flex items-center justify-between">
          <span>✓ {feedbackNotice}</span>
          <button onClick={() => setFeedbackNotice('')} className="text-green-600 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or topic..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {topics.map((top) => (
            <button
              key={top}
              onClick={() => setSelectedTopic(top)}
              className={`px-3 py-1 rounded font-semibold whitespace-nowrap transition ${
                selectedTopic === top
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Topic</th>
                <th className="py-2.5 px-4">Difficulty</th>
                <th className="py-2.5 px-4 text-center">Points</th>
                <th className="py-2.5 px-4 text-center">Time Limit</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChallenges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No challenges available.
                  </td>
                </tr>
              ) : (
                filteredChallenges.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      <div>
                        <span>{c.title}</span>
                        <p className="text-[11px] text-gray-400 font-normal line-clamp-1">{c.description}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                        {c.topic}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-700">
                      {c.difficulty}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-blue-600">
                      {c.points} XP
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-center text-gray-500">
                      {c.timeLimit || '1.0s'}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleStatus(c)}
                        title="Click to toggle status"
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                          c.status === 'published'
                            ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {c.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(c.id)}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-lg border border-gray-200 text-center space-y-3 text-xs">
            <h3 className="text-base font-bold text-gray-900">Delete this challenge?</h3>
            <p className="text-gray-500">
              This action will remove the challenge and its associated test cases.
            </p>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingChallenge ? 'Edit Challenge' : 'Add New Challenge'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Invert a Binary Tree"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Topic *
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    {topics.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Points (XP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="500"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Problem Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed algorithm problem statement..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Input Format</label>
                  <textarea
                    rows={2}
                    value={formData.inputFormat}
                    onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Output Format</label>
                  <textarea
                    rows={2}
                    value={formData.outputFormat}
                    onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sample Input *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.sampleInput}
                    onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sample Output *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.sampleOutput}
                    onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  {editingChallenge ? 'Save Changes' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChallenges;
