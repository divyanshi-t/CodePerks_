import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getChallenges,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  setUsers,
  getSubmissions,
  setSubmissions,
  getNotifications,
  setNotifications
} from '../../utils/localStorage';
import { simulateEvaluation } from '../../utils/points';

export const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [user, setUser] = useState(getCurrentUser());
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputResult, setOutputResult] = useState(null);

  useEffect(() => {
    const all = getChallenges();
    const ch = all.find(c => c.id === id) || all[0];
    setChallenge(ch);
    setUser(getCurrentUser());

    if (ch && ch.starterCodes) {
      setCode(ch.starterCodes.python || '');
    }
  }, [id]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (challenge && challenge.starterCodes && challenge.starterCodes[newLang]) {
      setCode(challenge.starterCodes[newLang]);
    }
    setOutputResult(null);
  };

  const handleResetCode = () => {
    if (challenge && challenge.starterCodes && challenge.starterCodes[language]) {
      setCode(challenge.starterCodes[language]);
      setOutputResult(null);
    }
  };

  const handleRunCode = () => {
    if (!challenge) return;
    setIsRunning(true);

    setTimeout(() => {
      const res = simulateEvaluation(challenge, code, language, true, customInput || challenge.sampleInput);
      setOutputResult(res);
      setIsRunning(false);
    }, 500);
  };

  const handleSubmitCode = () => {
    if (!challenge || !user) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const evaluation = simulateEvaluation(challenge, code, language, false);
      const isAccepted = evaluation.status === 'Accepted';

      const allSubmissions = getSubmissions();
      const userPrevSolves = allSubmissions.filter(
        s => s.userId === user.id && s.challengeId === challenge.id && s.status === 'Accepted'
      );
      const alreadySolved = userPrevSolves.length > 0;
      const pointsEarned = isAccepted && !alreadySolved ? challenge.points : 0;

      const newSubmission = {
        id: `sub_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        topic: challenge.topic,
        language,
        code,
        status: evaluation.status,
        score: evaluation.score,
        pointsEarned,
        testCasesPassed: evaluation.passedCount,
        totalTestCases: evaluation.totalCount,
        executionTime: evaluation.executionTime,
        memory: evaluation.memory,
        submittedAt: new Date().toLocaleString(),
        feedback: evaluation.feedback,
        testCaseResults: evaluation.testCaseResults
      };

      allSubmissions.unshift(newSubmission);
      setSubmissions(allSubmissions);

      // Update User stats
      const allUsers = getUsers();
      const currentUserObj = allUsers.find(u => u.id === user.id) || { ...user };
      currentUserObj.attemptedCount = (currentUserObj.attemptedCount || 0) + 1;

      if (isAccepted && !alreadySolved) {
        currentUserObj.solvedCount = (currentUserObj.solvedCount || 0) + 1;
        currentUserObj.skillPoints = (currentUserObj.skillPoints || 0) + pointsEarned;
        currentUserObj.streak = (currentUserObj.streak || 0) + 1;
      }

      if (currentUserObj.attemptedCount > 0) {
        currentUserObj.accuracy = Math.round(
          ((currentUserObj.solvedCount || 0) / currentUserObj.attemptedCount) * 100
        );
      }

      const finalUser = currentUserObj;

      const allNotifs = getNotifications();
      allNotifs.unshift({
        id: `notif_${Date.now()}_sub`,
        userId: finalUser.id,
        title: isAccepted ? `Challenge Solved: ${challenge.title}` : `Submission Attempted: ${challenge.title}`,
        message: isAccepted
          ? `Solved successfully! Earned ${pointsEarned} XP.`
          : `Status: ${evaluation.status}. Passed ${evaluation.passedCount}/${evaluation.totalCount} testcases.`,
        type: isAccepted ? 'reward' : 'challenge',
        read: false,
        createdAt: new Date().toLocaleString(),
        link: `/student/challenges/${challenge.id}`
      });
      setNotifications(allNotifs);

      const updatedUsersList = allUsers.map(u => u.id === finalUser.id ? finalUser : u);
      setUsers(updatedUsersList);
      setCurrentUser(finalUser);
      setUser(finalUser);

      setIsSubmitting(false);
      navigate(`/student/submission/${newSubmission.id}`);
    }, 800);
  };

  if (!challenge) return null;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Link
            to={`/student/challenges/${challenge.id}`}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-900 text-xs truncate">{challenge.title}</span>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {challenge.points} XP
          </span>
        </div>

        {/* Language select & Run/Submit Buttons */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded font-semibold text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          >
            <option value="python">Python 3</option>
            <option value="cpp">C++ 17</option>
            <option value="java">Java 17</option>
            <option value="c">C (GCC)</option>
          </select>

          <button
            onClick={handleResetCode}
            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 font-medium"
          >
            Reset
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded font-semibold disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Code'}
          </button>
        </div>
      </div>

      {/* Main Split: Left Problem Statement / Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Problem Statement (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-4 shadow-xs overflow-y-auto max-h-[500px] space-y-3 text-xs">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{challenge.title}</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          <div className="bg-gray-50 p-2.5 rounded border border-gray-200 space-y-1.5">
            <p className="font-mono text-[11px] text-gray-700"><strong>Input:</strong> {challenge.inputFormat}</p>
            <p className="font-mono text-[11px] text-gray-700"><strong>Output:</strong> {challenge.outputFormat}</p>
          </div>

          {challenge.constraints && (
            <div>
              <h4 className="font-bold text-gray-800 mb-0.5">Constraints:</h4>
              <pre className="bg-gray-50 p-2 rounded text-[11px] font-mono border border-gray-200 text-gray-700">
                {challenge.constraints}
              </pre>
            </div>
          )}

          <div>
            <h4 className="font-bold text-gray-800 mb-1">Sample Input & Output:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Input:</span>
                <pre className="bg-gray-50 p-2 rounded text-[11px] font-mono text-gray-800 border border-gray-200">
                  {challenge.sampleInput}
                </pre>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Output:</span>
                <pre className="bg-gray-50 p-2 rounded text-[11px] font-mono text-gray-800 border border-gray-200">
                  {challenge.sampleOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Textarea Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs text-gray-500 font-semibold mb-2">
              <span>Code Editor ({language})</span>
              <span>UTF-8</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your code solution here..."
              rows={16}
              spellCheck="false"
              className="w-full bg-gray-900 text-gray-100 font-mono text-xs p-3 rounded border border-gray-800 focus:outline-hidden leading-5 resize-y"
            />
          </div>

          {/* Optional Custom Input Box */}
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
            <details className="text-gray-600">
              <summary className="cursor-pointer font-semibold text-[11px] hover:text-gray-900">
                Custom Test Input (Optional)
              </summary>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom input..."
                rows={2}
                className="w-full mt-1.5 p-2 bg-gray-50 border border-gray-300 rounded font-mono text-xs"
              />
            </details>
          </div>
        </div>
      </div>

      {/* Bottom: Console Output / Test Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h4 className="font-bold text-gray-900">Output Console & Test Results</h4>
          {outputResult && (
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] border ${
                outputResult.status === 'Accepted' || outputResult.status === 'Run Successful'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {outputResult.status}
            </span>
          )}
        </div>

        {!outputResult ? (
          <p className="text-gray-400 text-xs py-3 text-center">
            Click "Run Code" or "Submit Code" to view test results.
          </p>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-gray-100 p-2.5 rounded border border-gray-200 text-gray-800">
              <p><strong>Feedback:</strong> {outputResult.feedback || outputResult.output}</p>
              {outputResult.executionTime && (
                <p className="text-gray-500 text-[11px] mt-1">Execution Time: {outputResult.executionTime} | Memory: {outputResult.memory}</p>
              )}
            </div>

            {outputResult.testCaseResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                {outputResult.testCaseResults.map((tc, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-xs flex items-center justify-between ${
                      tc.passed
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <span>Testcase #{idx + 1} {tc.isHidden ? '(Hidden)' : ''}</span>
                    <span className="font-bold">{tc.passed ? '✓ PASSED' : '✕ FAILED'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
