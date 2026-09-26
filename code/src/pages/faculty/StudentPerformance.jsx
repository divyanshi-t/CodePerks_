import React, { useState, useEffect } from 'react';
import { apiGetUsers, apiGetSubmissions } from '../../utils/api';

export const StudentPerformance = () => {
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, submissionsData] = await Promise.all([
          apiGetUsers(),
          apiGetSubmissions()
        ]);
        setStudents(usersData.filter(u => u.role === 'student'));
        setSubmissionsList(submissionsData);
      } catch (err) {
        setError('Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'points') return (b.skillPoints || 0) - (a.skillPoints || 0);
    if (sortBy === 'accuracy') return (b.accuracy || 0) - (a.accuracy || 0);
    if (sortBy === 'solved') return (b.solvedCount || 0) - (a.solvedCount || 0);
    if (sortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
    return 0;
  });

  const filteredStudents = sortedStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const studentSubmissions = selectedStudent
    ? submissions.filter(s => s.userId === selectedStudent.id)
    : [];

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading student data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Performance Roster
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor student solving accuracy, skill points, and coding consistency.
          </p>
        </div>

        <div className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded text-gray-600">
          <span>Enrolled Students: <strong>{students.length}</strong></span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search student or roll number..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-gray-500 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded font-semibold text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          >
            <option value="points">Skill Points (Highest)</option>
            <option value="accuracy">Accuracy %</option>
            <option value="solved">Challenges Solved</option>
            <option value="streak">Streak (Days)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Student ID</th>
                <th className="py-2.5 px-4 text-center">Solved</th>
                <th className="py-2.5 px-4 text-center">Accuracy</th>
                <th className="py-2.5 px-4 text-center">Streak</th>
                <th className="py-2.5 px-4 text-center">Skill Points</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    {students.length === 0 ? 'No students registered yet.' : 'No matching students found.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-800">#{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{st.name}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono">
                      {st.studentId || st.rollNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-800">{st.solvedCount || 0}</td>
                    <td className="py-3 px-4 text-center font-bold text-green-700">{st.accuracy || 0}%</td>
                    <td className="py-3 px-4 text-center font-semibold text-amber-700">{st.streak || 0}d</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{st.skillPoints || 0} XP</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-2.5 py-1 bg-white border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-lg border border-gray-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-500">
                  {selectedStudent.studentId || selectedStudent.rollNumber || '-'}
                </p>
                <p className="text-gray-400">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Points</span>
                <span className="font-bold text-blue-600">{selectedStudent.skillPoints || 0} XP</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Solved</span>
                <span className="font-bold text-gray-900">{selectedStudent.solvedCount || 0}</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Streak</span>
                <span className="font-bold text-amber-600">{selectedStudent.streak || 0}d</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Accuracy</span>
                <span className="font-bold text-green-700">{selectedStudent.accuracy || 0}%</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 uppercase text-[11px] mb-1.5">
                Submission Records ({studentSubmissions.length})
              </h4>
              <div className="border border-gray-200 rounded divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {studentSubmissions.length === 0 ? (
                  <p className="p-3 text-center text-gray-400">No submissions recorded.</p>
                ) : (
                  studentSubmissions.map(s => (
                    <div key={s.id} className="p-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-800">{s.challengeTitle}</span>
                        <span className="text-gray-400 block text-[10px]">{s.submittedAt}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;
