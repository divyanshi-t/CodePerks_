import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSubmissions, getCurrentUser } from '../../utils/localStorage';

export const SubmissionResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const all = getSubmissions();
    const found = all.find(s => s.id === id) || all[0];
    setSubmission(found);
    setUser(getCurrentUser());
  }, [id]);

  if (!submission) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-lg text-center text-xs text-gray-500">
        <p className="font-bold text-sm text-gray-800">Submission Record Not Found</p>
        <Link to="/student/challenges" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Challenges
        </Link>
      </div>
    );
  }

  const isAccepted = submission.status === 'Accepted';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Result Status Card */}
      <div
        className={`border rounded-lg p-6 shadow-xs ${
          isAccepted
            ? 'bg-green-50/70 border-green-300 text-green-900'
            : 'bg-red-50/70 border-red-300 text-red-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 opacity-80">
              Evaluation Result
            </span>
            <h1 className="text-2xl font-bold">
              {isAccepted ? '✓ Status: Accepted' : '✕ Status: Wrong Answer'}
            </h1>
            <p className="text-xs mt-1">
              Problem: <strong>{submission.challengeTitle}</strong> ({submission.topic})
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs block opacity-80">Score Earned</span>
            <span className="text-2xl font-extrabold text-blue-700">
              +{submission.pointsEarned || submission.score} XP
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-3.5 border border-gray-200 rounded-lg text-center shadow-xs">
          <span className="text-gray-500 block">Testcases Passed</span>
          <span className="text-base font-bold text-gray-900 mt-1 block">
            {submission.testCasesPassed} / {submission.totalTestCases}
          </span>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 rounded-lg text-center shadow-xs">
          <span className="text-gray-500 block">Runtime</span>
          <span className="text-base font-bold text-gray-900 mt-1 block">
            {submission.executionTime || '14ms'}
          </span>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 rounded-lg text-center shadow-xs">
          <span className="text-gray-500 block">Memory</span>
          <span className="text-base font-bold text-gray-900 mt-1 block">
            {submission.memory || '9.2 MB'}
          </span>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 rounded-lg text-center shadow-xs">
          <span className="text-gray-500 block">Language</span>
          <span className="text-base font-bold text-gray-900 mt-1 block uppercase font-mono">
            {submission.language}
          </span>
        </div>
      </div>

      {/* Feedback Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-gray-900 uppercase text-[11px]">
          Evaluation Feedback
        </h3>
        <p className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-700 leading-relaxed font-mono">
          {submission.feedback}
        </p>

        {submission.testCaseResults && (
          <div className="pt-2">
            <h4 className="font-bold text-gray-800 mb-2">Test Case Results:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {submission.testCaseResults.map((tc, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border text-xs flex items-center justify-between ${
                    tc.passed
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <span>Testcase #{idx + 1} {tc.isHidden ? '(Hidden)' : ''}</span>
                  <span className="font-bold">{tc.passed ? '✓ PASSED' : '✕ FAILED'} ({tc.time})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate(`/student/editor/${submission.challengeId}`)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-semibold border border-gray-300 transition"
        >
          Modify Code
        </button>

        <div className="flex items-center space-x-2">
          <Link
            to="/student/leaderboard"
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded text-xs font-semibold border border-gray-300 transition"
          >
            Check Leaderboard
          </Link>
          <Link
            to="/student/challenges"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
          >
            Next Challenge →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
