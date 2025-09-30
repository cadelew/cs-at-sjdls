import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);

  // Calculate progress percentages (you can enhance this with real data later)
  const calculateProgress = (progressMap) => {
    if (!progressMap || Object.keys(progressMap).length === 0) return 0;
    const completed = Object.values(progressMap).filter(Boolean).length;
    const total = Object.keys(progressMap).length;
    return Math.round((completed / total) * 100);
  };

  const checklistProgress = calculateProgress(currentUser?.checklistProgress);
  const cyberPatriotProgress = calculateProgress(currentUser?.cyberPatriotProgress);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              Welcome Back
            </span>
            Welcome Back
          </h1>
        </div>


        {/* Quick Access */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/getting-started"
              className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6 text-center hover:bg-amber-200 dark:hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Getting Started
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set up your development environment
              </p>
            </Link>
            <Link
              to="/resources"
              className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6 text-center hover:bg-amber-200 dark:hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Resources
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Opportunities and learning materials
              </p>
            </Link>
            <Link
              to="/checklist"
              className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6 text-center hover:bg-amber-200 dark:hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                AP CSP Checklist
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your Create Task progress
              </p>
            </Link>
            <Link
              to="/cyberpatriot-checklist"
              className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6 text-center hover:bg-amber-200 dark:hover:bg-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                CyberPatriot
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Security competition checklist
              </p>
            </Link>
          </div>
        </div>

        {/* Course-Specific Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Your Courses
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* PLTW Computer Science Essentials */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 text-center">
                PLTW Computer Science Essentials
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                Foundational computer science concepts and programming fundamentals for beginners.
              </p>
              <div className="space-y-3">
                <Link
                  to="/cs-home"
                  className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105 shadow-lg"
                >
                  Course Home
                </Link>
                <Link
                  to="/getting-started"
                  className="block w-full px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* AP Computer Science Principles */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 text-center">
                AP Computer Science Principles
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                College-level computer science course covering big ideas and computational thinking.
              </p>
              <div className="space-y-3">
                <Link
                  to="/checklist"
                  className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105 shadow-lg"
                >
                  Create Task Checklist
                </Link>
                <Link
                  to="/ap-csp-review"
                  className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105 shadow-lg"
                >
                  Exam Review
                </Link>
                <Link
                  to="/cs-home"
                  className="block w-full px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105"
                >
                  Course Home
                </Link>
              </div>
            </div>

            {/* Cybersecurity */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 text-center">
                PLTW Cybersecurity
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                Protecting digital systems and data from cyber threats and attacks.
              </p>
              <div className="space-y-3">
                <Link
                  to="/cyberpatriot-checklist"
                  className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105 shadow-lg"
                >
                  CyberPatriot Checklist
                </Link>
                <Link
                  to="/cyberpatriot-home"
                  className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105 shadow-lg"
                >
                  Competition Info
                </Link>
                <Link
                  to="/cs-home"
                  className="block w-full px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 text-center hover:transform hover:scale-105"
                >
                  Course Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            Need help? Check out the Getting Started guide or contact your teacher.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keep up the great work on your computer science journey!
          </p>
        </div>
      </div>
    </div>
  );
}
