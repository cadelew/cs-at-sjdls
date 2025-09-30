import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CsHome() {
  const [selectedCourse, setSelectedCourse] = useState('pltw');

  const courses = [
    {
      id: 'pltw',
      name: 'PLTW Computer Science Essentials',
      icon: '',
      description: 'Foundational computer science concepts and programming fundamentals',
      prerequisites: 'No prior experience required',
      skills: ['Programming basics', 'Problem solving', 'Computational thinking', 'Digital citizenship'],
      careers: ['Software Developer', 'Web Developer', 'Data Analyst', 'IT Specialist'],
      modules: [
        'Introduction to Computer Science',
        'Programming Fundamentals',
        'Data Structures',
        'Algorithms',
        'Web Development',
        'Database Design',
        'Cybersecurity Basics',
        'Capstone Project'
      ]
    },
    {
      id: 'apcsp',
      name: 'AP Computer Science Principles',
      icon: '',
      description: 'College-level computer science course covering big ideas and computational thinking',
      prerequisites: 'Basic math skills recommended',
      skills: ['Computational thinking', 'Programming', 'Data analysis', 'Internet & networking'],
      careers: ['Computer Scientist', 'Software Engineer', 'Data Scientist', 'Cybersecurity Analyst'],
      bigIdeas: [
        'Creative Development',
        'Data',
        'Algorithms & Programming',
        'Computer Systems & Networks',
        'Impact of Computing'
      ]
    },
    {
      id: 'cybersecurity',
      name: 'PLTW Cybersecurity',
      icon: '',
      description: 'Protecting digital systems and data from cyber threats and attacks',
      prerequisites: 'Basic computer skills',
      skills: ['Network security', 'Threat analysis', 'Incident response', 'Risk assessment'],
      careers: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Engineer', 'Digital Forensics Expert'],
      focusAreas: [
        'Network Security',
        'Digital Forensics',
        'Ethical Hacking',
        'Risk Management',
        'Incident Response',
        'Security Policies'
      ]
    }
  ];

  const currentCourse = courses.find(course => course.id === selectedCourse);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              CS Home
            </span>
            CS Home
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose your computer science pathway and explore the resources available for each course
          </p>
        </div>

        {/* Course Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Select Your Course
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`p-8 rounded-xl border-2 transition-all duration-300 ${
                  selectedCourse === course.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 transform scale-105 shadow-lg'
                    : 'border-black dark:border-purple-500 bg-amber-50 dark:bg-black hover:bg-amber-100 dark:hover:bg-gray-800 hover:transform hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-4 text-center">{course.icon}</div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3 text-center">
                  {course.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-center text-sm">
                  {course.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Course Details */}
        {currentCourse && (
          <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentCourse.icon}</div>
              <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
                {currentCourse.name}
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                {currentCourse.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  📋 Prerequisites
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {currentCourse.prerequisites}
                </p>
              </div>
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  Skills You'll Learn
                </h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {currentCourse.skills.map((skill, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  💼 Career Paths
                </h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {currentCourse.careers.map((career, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 dark:text-green-400">•</span>
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  {currentCourse.id === 'pltw' ? 'Modules' : 
                   currentCourse.id === 'apcsp' ? 'Big Ideas' : 'Focus Areas'}
                </h3>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  {(currentCourse.modules || currentCourse.bigIdeas || currentCourse.focusAreas).map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Ready to Get Started?
              </h3>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                {currentCourse.id === 'pltw' && (
                  <>
                    <Link
                      to="/getting-started"
                      className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/getting-started"
                      className="inline-flex items-center px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Course Materials
                    </Link>
                  </>
                )}
                {currentCourse.id === 'apcsp' && (
                  <>
                    <Link
                      to="/checklist"
                      className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      📋 AP CSP Checklist
                    </Link>
                    <Link
                      to="/ap-csp-review"
                      className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      📖 AP CSP Review
                    </Link>
                    <Link
                      to="/getting-started"
                      className="inline-flex items-center px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                    </Link>
                  </>
                )}
                {currentCourse.id === 'cybersecurity' && (
                  <>
                    <Link
                      to="/cyberpatriot-checklist"
                      className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      CyberPatriot Checklist
                    </Link>
                    <Link
                      to="/cyberpatriot-home"
                      className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🏠 CyberPatriot Home
                    </Link>
                    <Link
                      to="/getting-started"
                      className="inline-flex items-center px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

         {/* Additional Resources */}
         <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
           <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
             Additional Resources
           </h2>
           <div className="grid md:grid-cols-2 gap-8">
             <div>
               <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                 General CS Resources
               </h3>
               <ul className="space-y-3">
                 <li>
                   <a 
                     href="https://www.codecademy.com" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     Codecademy - Interactive Programming Lessons
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.khanacademy.org/computing" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     Khan Academy - Computer Science Courses
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.freecodecamp.org" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     freeCodeCamp - Free Coding Bootcamp
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.edx.org/course/introduction-computer-science-mitx-6-00-1x-10" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     MIT Introduction to Computer Science
                   </a>
                 </li>
               </ul>
             </div>
             <div>
               <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                 Development Tools
               </h3>
               <ul className="space-y-3">
                 <li>
                   <a 
                     href="https://code.visualstudio.com/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     Visual Studio Code - Code Editor
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.github.com" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                     GitHub - Code Repository Platform
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.replit.com" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                    Replit - Online IDE
                   </a>
                 </li>
                 <li>
                   <a 
                     href="https://www.codepen.io" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                   >
                    CodePen - Frontend Development Playground
                   </a>
                 </li>
               </ul>
             </div>
           </div>
         </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            Questions about courses? Talk to your computer science teacher or guidance counselor.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All courses are designed to prepare you for college and career success in technology.
          </p>
        </div>
      </div>
    </div>
  );
}
