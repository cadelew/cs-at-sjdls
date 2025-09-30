import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black">
      {/* Hero Section */}
      <div className="pt-56 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="mb-8 relative py-8 flex justify-center items-center text-black dark:text-white text-6xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-6xl box-content font-extrabold text-transparent select-none">
              Welcome to Computer Science at SJDLS
            </span>
            Welcome to Computer Science at SJDLS
          </h1>
          
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="#courses"
              className="px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-bold text-lg rounded-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Course Offerings Section */}
      <div id="courses" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black dark:text-white mb-6">
              PLTW Course Offerings
            </h2>
            
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Computer Science Essentials */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  PLTW Computer Science Essentials
                </h3>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Build foundational programming skills with Python and explore computational thinking concepts.
                </p>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Introduction to Python programming</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Computational thinking and problem solving</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Data structures and algorithms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Project-based learning</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Link
                  to="/getting-started"
                  className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* AP Computer Science Principles */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  AP Computer Science Principles
                </h3>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Master college-level computer science concepts and prepare for the AP exam.
                </p>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Big Ideas in computer science</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Create Performance Task</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Computational thinking practices</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>AP exam preparation</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Link
                  to="/sign-up"
                  className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
                >
                  Sign Up to Access
                </Link>
              </div>
            </div>

            {/* Cybersecurity */}
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  PLTW Cybersecurity
                </h3>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Learn to protect digital systems and compete in cybersecurity competitions.
                </p>
                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Network security fundamentals</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>CyberPatriot competition</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Ethical hacking and defense</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">•</span>
                    <span>Digital forensics</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Link
                  to="/cyberpatriot-home"
                  className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Resources Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black dark:text-white mb-6">
              Additional Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access tools, opportunities, and support to enhance your computer science journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/getting-started"
              className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 text-center hover:bg-amber-100 dark:hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                Getting Started Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your development environment and learn the essential tools for programming.
              </p>
            </Link>
            <Link
              to="/resources"
              className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 text-center hover:bg-amber-100 dark:hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                Resources & Opportunities
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover scholarships, internships, summer programs, and learning materials.
              </p>
            </Link>
            <Link
              to="/cyberpatriot-home"
              className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-8 text-center hover:bg-amber-100 dark:hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                CyberPatriot Competition
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn about the national cybersecurity competition and how to participate.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-20 px-6 bg-purple-600 dark:bg-purple-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Computer Science Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join our program and develop the skills you need for success in technology and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              Create Your Account
            </Link>
            <Link
              to="/sign-in"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold text-lg rounded-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
