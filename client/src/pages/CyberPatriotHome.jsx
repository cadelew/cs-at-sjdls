import React from 'react';
import { Link } from 'react-router-dom';

export default function CyberPatriotHome() {
  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              CyberPatriot Competition
            </span>
            CyberPatriot Competition
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The National Youth Cyber Education Program
          </p>
        </div>

        {/* What is CyberPatriot */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
            🛡️ What is CyberPatriot?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                CyberPatriot is the National Youth Cyber Education Program created by the Air & Space Forces Association. 
                It's the nation's largest cybersecurity competition for high school and middle school students.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Teams compete in a series of online rounds, defending virtual networks and computer systems from 
                simulated cyber attacks. The competition tests students' ability to identify and fix security vulnerabilities.
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 border border-purple-500 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
                🎯 Competition Goals
              </h3>
              <ul className="space-y-3 text-purple-700 dark:text-purple-300">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Inspire students toward careers in cybersecurity</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Develop critical thinking and problem-solving skills</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Promote teamwork and collaboration</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Build awareness of cybersecurity threats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Competition Format */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            🏆 Competition Format
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
              <div className="text-4xl mb-4 text-center">📅</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3 text-center">
                Season Structure
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Practice Rounds:</strong> September - October</li>
                <li>• <strong>Qualification Round:</strong> November</li>
                <li>• <strong>State Round:</strong> December</li>
                <li>• <strong>Semifinals:</strong> January</li>
                <li>• <strong>National Finals:</strong> March</li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
              <div className="text-4xl mb-4 text-center">💻</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3 text-center">
                Competition Types
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Windows:</strong> Server and client systems</li>
                <li>• <strong>Linux:</strong> Ubuntu and other distributions</li>
                <li>• <strong>Cisco Networking:</strong> Network configuration</li>
                <li>• <strong>Digital Forensics:</strong> Evidence analysis</li>
                <li>• <strong>Cryptography:</strong> Encryption challenges</li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6">
              <div className="text-4xl mb-4 text-center">👥</div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3 text-center">
                Team Structure
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• <strong>Team Size:</strong> 2-6 students</li>
                <li>• <strong>Divisions:</strong> Open, All Service, Middle School</li>
                <li>• <strong>Coaches:</strong> Teachers or mentors</li>
                <li>• <strong>Registration:</strong> Through school</li>
                <li>• <strong>Cost:</strong> Free for schools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills Developed */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Skills You'll Develop
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'System Hardening', description: 'Secure Windows and Linux systems' },
              { title: 'Network Security', description: 'Configure and protect networks' },
              { title: 'Digital Forensics', description: 'Analyze digital evidence' },
              { title: 'Cryptography', description: 'Understand encryption methods' },
              { title: 'Incident Response', description: 'Handle security breaches' },
              { title: 'Risk Assessment', description: 'Evaluate security vulnerabilities' },
              { title: 'Teamwork', description: 'Collaborate under pressure' },
              { title: 'Problem Solving', description: 'Think critically and creatively' }
            ].map((skill, index) => (
              <div key={index} className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{skill.icon}</div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {skill.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            🎯 Getting Started
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                How to Join CyberPatriot
              </h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                  <span>Talk to your computer science teacher about forming a team</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                  <span>Register your team through the CyberPatriot website</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                  <span>Start practicing with the CyberPatriot checklist</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                  <span>Participate in practice rounds to build skills</span>
                </li>
              </ol>
            </div>
            <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
                💡 Pro Tips
              </h3>
              <ul className="space-y-3 text-green-700 dark:text-green-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                  <span>Start with Windows systems - they're easier to learn</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                  <span>Practice regularly, even just 30 minutes a day</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                  <span>Learn to work as a team - communication is key</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">•</span>
                  <span>Don't get discouraged - cybersecurity takes time to master</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            📚 Resources & Links
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Official CyberPatriot Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.uscyberpatriot.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Official CyberPatriot Website
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.uscyberpatriot.org/competition/competition-overview" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Competition Overview & Rules
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.uscyberpatriot.org/training" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Training Materials
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.uscyberpatriot.org/competition/competition-overview/competition-timeline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Competition Timeline
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Additional Learning Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.cybrary.it" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Cybrary - Free Cybersecurity Training
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.tryhackme.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    TryHackMe - Hands-on Labs
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.hackthebox.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    HackTheBox - Advanced Challenges
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.cisecurity.org/controls/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    CIS Controls - Security Best Practices
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            Ready to Start Your CyberPatriot Journey?
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              to="/cyberpatriot-checklist"
              className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start CyberPatriot Checklist
            </Link>
            <Link
              to="/getting-started"
              className="inline-flex items-center px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started with Tools
            </Link>
            <Link
              to="/cs-home"
              className="inline-flex items-center px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore CS Courses
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            Questions about CyberPatriot? Talk to your computer science teacher or check the official website.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            CyberPatriot is a program of the Air & Space Forces Association
          </p>
        </div>
      </div>
    </div>
  );
}
