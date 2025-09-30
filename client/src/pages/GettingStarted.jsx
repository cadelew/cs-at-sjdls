import React, { useState } from 'react';

export default function GettingStarted() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedOS, setSelectedOS] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', icon: '' },
    { id: 'choose-os', title: 'Choose OS', icon: '' },
    { id: 'dev-environment', title: 'VS Code Setup', icon: '' },
    { id: 'git-github', title: 'Git & GitHub', icon: '' },
    { id: 'first-project', title: 'First Project', icon: '' },
    { id: 'next-steps', title: 'Next Steps', icon: '' }
  ];

  const operatingSystems = [
    {
      id: 'windows',
      name: 'Windows',
      icon: '',
      description: 'Most common for beginners',
      pros: ['Familiar interface', 'Great for beginners', 'Wide software support']
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '',
      description: 'Popular among developers',
      pros: ['Unix-based', 'Great development tools', 'Smooth experience']
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: '',
      description: 'Powerful and flexible',
      pros: ['Free and open source', 'Highly customizable', 'Great for servers']
    }
  ];

  const vscodeExtensions = [
    {
      name: 'Python',
      description: 'Official Python extension with IntelliSense, debugging, and more',
      features: ['Syntax highlighting', 'Code completion', 'Debugging', 'Linting']
    },
    {
      name: 'Live Server',
      description: 'Launch a development local Server with live reload feature',
      features: ['Live reload', 'Local server', 'Quick preview', 'Auto-refresh']
    },
    {
      name: 'Prettier',
      description: 'Code formatter that enforces consistent code style',
      features: ['Auto-formatting', 'Consistent style', 'Multiple languages', 'Configurable']
    },
    {
      name: 'GitLens',
      description: 'Supercharge Git capabilities with blame annotations and more',
      features: ['Git blame', 'File history', 'Commit details', 'Repository insights']
    },
    {
      name: 'Thunder Client',
      description: 'Lightweight REST API Client for VS Code',
      features: ['API testing', 'Request collections', 'Environment variables', 'GraphQL support']
    },
    {
      name: 'Auto Rename Tag',
      description: 'Automatically rename paired HTML/XML tags',
      features: ['Auto-rename', 'HTML/XML support', 'Real-time updates', 'Paired tags']
    },
    {
      name: 'Bracket Pair Colorizer',
      description: 'Colorize matching bracket pairs for better code readability',
      features: ['Color coding', 'Nested brackets', 'Customizable colors', 'Multiple languages']
    },
    {
      name: 'Path Intellisense',
      description: 'Autocompletes filenames in import statements',
      features: ['File path completion', 'Import suggestions', 'Quick navigation', 'Smart matching']
    },
    {
      name: 'Material Icon Theme',
      description: 'Beautiful material design icons for your files and folders',
      features: ['File type icons', 'Folder icons', 'Customizable', 'Material design']
    },
    {
      name: 'Error Lens',
      description: 'Show errors and warnings inline in your code',
      features: ['Inline errors', 'Real-time feedback', 'Multiple languages', 'Customizable display']
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <div className="text-7xl mb-6"></div>
            <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
              Welcome to Computer Science at SJDLS!
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              This guide will help you set up everything you need to start your computer science journey.
              We'll walk through each step together!
            </p>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                What You'll Learn:
              </h3>
              <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>How to choose and set up your development environment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Essential tools for programming</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>Version control with Git and GitHub</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">•</span>
                  <span>How to create and manage your first project</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                handleStepComplete('welcome');
                handleNext();
              }}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Let's Get Started!
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
                Choose Your Operating System
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Don't worry - you can always change later! Pick what you're most comfortable with.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {operatingSystems.map((os) => (
                <div
                  key={os.id}
                  className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedOS === os.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 transform scale-105 shadow-lg'
                      : 'border-black dark:border-purple-500 bg-amber-50 dark:bg-black hover:bg-amber-100 dark:hover:bg-gray-800 hover:transform hover:scale-105'
                  }`}
                  onClick={() => setSelectedOS(os.id)}
                >
                  <div className="text-5xl mb-4 text-center">{os.icon}</div>
                  <h3 className="text-2xl font-semibold text-black dark:text-white mb-3 text-center">
                    {os.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
                    {os.description}
                  </p>
                  <div className="space-y-2">
                    {os.pros.map((pro, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedOS && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
                  ✅ Great Choice!
                </h3>
                <p className="text-lg text-green-700 dark:text-green-300">
                  You've selected {operatingSystems.find(os => os.id === selectedOS)?.name}.
                  Now let's set up VS Code, which works great on all operating systems!
                </p>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  if (selectedOS) {
                    handleStepComplete('choose-os');
                    handleNext();
                  }
                }}
                disabled={!selectedOS}
                className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  selectedOS
                    ? 'bg-purple-600 hover:bg-purple-700 text-white hover:transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
                Set Up VS Code
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Visual Studio Code is the most popular code editor. Let's get it set up with the right extensions!
              </p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-500 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
                📥 Download VS Code
              </h3>
              <p className="text-lg text-blue-700 dark:text-blue-300 mb-4">
                First, download and install VS Code from the official website:
              </p>
              <a
                href="https://code.visualstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Download VS Code
              </a>
            </div>

            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                🔌 Essential Extensions
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Install these extensions to supercharge your development experience:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {vscodeExtensions.map((extension, index) => (
                  <div key={index} className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
                      {extension.name}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                      {extension.description}
                    </p>
                    <div className="space-y-1">
                      {extension.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span className="text-purple-600 dark:text-purple-400">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  handleStepComplete('dev-environment');
                  handleNext();
                }}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
                Git & GitHub Setup
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Learn version control - essential for any developer!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  What is Git?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Git is a version control system that tracks changes in your code. It's like a save system for your projects!
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Track changes in your code</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Collaborate with others</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Backup your work</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  What is GitHub?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  GitHub is a platform that hosts your Git repositories online. It's like Google Drive for code!
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Store your code online</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Share projects with others</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    <span>Build a portfolio</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
                Quick Setup Steps
              </h3>
              <ol className="space-y-3 text-green-700 dark:text-green-300">
                <li className="flex items-start space-x-3">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                  <span>Create a GitHub account at github.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                  <span>Download Git from git-scm.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                  <span>Configure Git with your name and email</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                  <span>Create your first repository on GitHub</span>
                </li>
              </ol>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  handleStepComplete('git-github');
                  handleNext();
                }}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
                Create Your First Project
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Time to put everything together and create your first coding project!
              </p>
            </div>

            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Project Ideas for Beginners
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                    Web Development
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Personal portfolio website</li>
                    <li>• Simple calculator</li>
                    <li>• To-do list app</li>
                    <li>• Weather app</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                    🐍 Python Projects
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Number guessing game</li>
                    <li>• Password generator</li>
                    <li>• Simple calculator</li>
                    <li>• Text-based adventure game</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-500 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
                📝 Project Checklist
              </h3>
              <ol className="space-y-3 text-blue-700 dark:text-blue-300">
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                  <span>Choose a project idea that interests you</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                  <span>Create a new folder for your project</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                  <span>Open the folder in VS Code</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                  <span>Create your first file and start coding!</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">5</span>
                  <span>Use Git to save your progress</span>
                </li>
              </ol>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={handlePrevious}
                className="px-8 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  handleStepComplete('first-project');
                  handleNext();
                }}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black dark:text-white mb-6">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                You've completed the setup guide! You're now ready to start your computer science journey.
              </p>
            </div>

            <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
                ✅ What You've Accomplished
              </h3>
              <ul className="space-y-3 text-green-700 dark:text-green-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                  <span>Chosen your operating system</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                  <span>Set up VS Code with essential extensions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                  <span>Learned about Git and GitHub</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                  <span>Got ideas for your first project</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Next Steps
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                    Continue Learning
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Practice coding daily</li>
                    <li>• Join coding communities</li>
                    <li>• Build more projects</li>
                    <li>• Learn new programming languages</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                    Set Goals
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Complete your first project</li>
                    <li>• Learn a new technology</li>
                    <li>• Contribute to open source</li>
                    <li>• Build your portfolio</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Ready to Start Coding?
              </h3>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button
                  onClick={() => {
                    handleStepComplete('next-steps');
                    setCurrentStep(0);
                    setCompletedSteps([]);
                    setSelectedOS('');
                  }}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🔄 Start Over
                </button>
                <button
                  onClick={handlePrevious}
                  className="px-8 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105"
                >
                  ← Previous
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-6 relative py-6 flex justify-center items-center text-black dark:text-white text-5xl font-extrabold text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-5xl box-content font-extrabold text-transparent select-none">
              Getting Started
            </span>
            Getting Started
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Set up your development environment and start your computer science journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : completedSteps.includes(step.id)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                    : 'bg-amber-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 hover:transform hover:scale-105'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
                {completedSteps.includes(step.id) && (
                  <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl p-10 shadow-lg">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            Need help? Contact your teacher or check the course materials.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This guide covers the basics - you'll learn much more in your courses!
          </p>
        </div>
      </div>
    </div>
  );
}
