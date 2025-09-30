import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';

export default function CyberPatriotChecklist() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  // CyberPatriot Checklist Items
  const windowsChecklist = [
    {
      id: 'windows-security',
      category: 'Windows Security Basics',
      items: [
        { 
          id: 'windows-firewall', 
          text: 'Enable Windows Firewall', 
          weight: 1,
          examples: [
            'Control Panel → System and Security → Windows Defender Firewall',
            'Turn Windows Defender Firewall on or off',
            'Enable for both Private and Public networks'
          ]
        },
        { 
          id: 'windows-updates', 
          text: 'Install Windows Updates', 
          weight: 1,
          examples: [
            'Settings → Update & Security → Windows Update',
            'Check for updates and install all available',
            'Restart if required'
          ]
        },
        { 
          id: 'windows-antivirus', 
          text: 'Enable Windows Defender Antivirus', 
          weight: 1,
          examples: [
            'Windows Security → Virus & threat protection',
            'Real-time protection: On',
            'Cloud-delivered protection: On'
          ]
        },
        { 
          id: 'windows-users', 
          text: 'Secure User Accounts', 
          weight: 1,
          examples: [
            'Control Panel → User Accounts',
            'Remove unnecessary user accounts',
            'Set strong passwords for remaining accounts'
          ]
        }
      ]
    },
    {
      id: 'windows-services',
      category: 'Windows Services & Processes',
      items: [
        { 
          id: 'windows-services', 
          text: 'Disable Unnecessary Services', 
          weight: 1,
          examples: [
            'services.msc → Find unnecessary services',
            'Right-click → Properties → Startup type: Disabled',
            'Common services to disable: Telnet, FTP, Remote Registry'
          ]
        },
        { 
          id: 'windows-processes', 
          text: 'Monitor Running Processes', 
          weight: 1,
          examples: [
            'Task Manager → Processes tab',
            'Look for suspicious or unknown processes',
            'End processes that are not needed'
          ]
        }
      ]
    },
    {
      id: 'windows-network',
      category: 'Network Security',
      items: [
        { 
          id: 'windows-network-sharing', 
          text: 'Disable Unnecessary Network Sharing', 
          weight: 1,
          examples: [
            'Control Panel → Network and Sharing Center',
            'Change advanced sharing settings',
            'Turn off file and printer sharing if not needed'
          ]
        },
        { 
          id: 'windows-remote-desktop', 
          text: 'Secure Remote Desktop', 
          weight: 1,
          examples: [
            'System Properties → Remote tab',
            'Disable Remote Desktop if not needed',
            'If enabled, use strong authentication'
          ]
        }
      ]
    }
  ];

  const linuxChecklist = [
    {
      id: 'linux-security',
      category: 'Linux Security Basics',
      items: [
        { 
          id: 'linux-firewall', 
          text: 'Configure UFW Firewall', 
          weight: 1,
          examples: [
            'sudo ufw enable',
            'sudo ufw default deny incoming',
            'sudo ufw default allow outgoing'
          ]
        },
        { 
          id: 'linux-updates', 
          text: 'Update System Packages', 
          weight: 1,
          examples: [
            'sudo apt update',
            'sudo apt upgrade',
            'sudo apt autoremove'
          ]
        },
        { 
          id: 'linux-users', 
          text: 'Secure User Accounts', 
          weight: 1,
          examples: [
            'sudo passwd username (set strong passwords)',
            'sudo usermod -L username (lock accounts)',
            'sudo deluser username (remove unnecessary users)'
          ]
        },
        { 
          id: 'linux-ssh', 
          text: 'Secure SSH Configuration', 
          weight: 1,
          examples: [
            'sudo nano /etc/ssh/sshd_config',
            'PermitRootLogin no',
            'PasswordAuthentication no (use keys)'
          ]
        }
      ]
    },
    {
      id: 'linux-services',
      category: 'Linux Services & Processes',
      items: [
        { 
          id: 'linux-services', 
          text: 'Disable Unnecessary Services', 
          weight: 1,
          examples: [
            'sudo systemctl list-unit-files --type=service',
            'sudo systemctl disable servicename',
            'sudo systemctl stop servicename'
          ]
        },
        { 
          id: 'linux-processes', 
          text: 'Monitor Running Processes', 
          weight: 1,
          examples: [
            'ps aux (list all processes)',
            'top (monitor processes in real-time)',
            'kill -9 PID (kill suspicious processes)'
          ]
        }
      ]
    },
    {
      id: 'linux-file-permissions',
      category: 'File Permissions & Ownership',
      items: [
        { 
          id: 'linux-permissions', 
          text: 'Set Proper File Permissions', 
          weight: 1,
          examples: [
            'chmod 644 filename (read/write for owner, read for others)',
            'chmod 755 directory (full access for owner, read/execute for others)',
            'chmod 600 sensitive_file (owner only)'
          ]
        },
        { 
          id: 'linux-ownership', 
          text: 'Fix File Ownership', 
          weight: 1,
          examples: [
            'chown username:groupname filename',
            'chown -R username:groupname directory',
            'sudo chown root:root /etc/passwd'
          ]
        }
      ]
    }
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [userChecklist, setUserChecklist] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  // Calculate progress percentage for selected platform
  const calculateProgress = () => {
    if (!selectedPlatform) return 0;
    
    const checklist = selectedPlatform === 'windows' ? windowsChecklist : linuxChecklist;
    const totalItems = checklist.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = Object.values(userChecklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  // Load user's checklist progress
  useEffect(() => {
    if (currentUser?.cyberPatriotProgress) {
      setUserChecklist(currentUser.cyberPatriotProgress);
    }
    setIsLoading(false);
  }, [currentUser]);

  // Handle checkbox change
  const handleCheckboxChange = async (itemId, isChecked) => {
    const updatedChecklist = {
      ...userChecklist,
      [itemId]: isChecked
    };
    
    setUserChecklist(updatedChecklist);

    // Update user's checklist progress in database
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cyberPatriotProgress: updatedChecklist
        }),
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  // Toggle dropdown for individual items
  const toggleDropdown = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle category toggle (check/uncheck all items in a category)
  const handleCategoryToggle = async (categoryId, isChecked) => {
    const checklist = selectedPlatform === 'windows' ? windowsChecklist : linuxChecklist;
    const category = checklist.find(cat => cat.id === categoryId);
    const updatedChecklist = { ...userChecklist };
    
    category.items.forEach(item => {
      updatedChecklist[item.id] = isChecked;
    });
    
    setUserChecklist(updatedChecklist);

    // Update in database
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cyberPatriotProgress: updatedChecklist
        }),
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading CyberPatriot checklist...</div>
      </div>
    );
  }

  const progressPercentage = calculateProgress();
  const currentChecklist = selectedPlatform === 'windows' ? windowsChecklist : linuxChecklist;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              CyberPatriot Competition Checklist
            </span>
            CyberPatriot Competition Checklist
          </h1>
          
          {!selectedPlatform ? (
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Choose Your Platform
              </h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button
                  onClick={() => setSelectedPlatform('windows')}
                  className="px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors text-xl font-semibold"
                >
                  Windows
                </button>
                <button
                  onClick={() => setSelectedPlatform('linux')}
                  className="px-8 py-4 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors text-xl font-semibold"
                >
                  Linux/Ubuntu
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-semibold text-black dark:text-white">
                    {selectedPlatform === 'windows' ? 'Windows Security' : 'Linux/Ubuntu Security'}
                  </h2>
                  <button
                    onClick={() => setSelectedPlatform(null)}
                    className="px-3 py-1 text-xs bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white rounded-full hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Change Platform
                  </button>
                </div>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {progressPercentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                Complete all items to secure your {selectedPlatform === 'windows' ? 'Windows' : 'Linux/Ubuntu'} system
              </p>
            </div>
          )}
        </div>

        {/* Checklist Categories */}
        {selectedPlatform && (
          <div className="space-y-6">
            {currentChecklist.map((category) => {
              const categoryProgress = category.items.filter(item => userChecklist[item.id]).length;
              const categoryPercentage = Math.round((categoryProgress / category.items.length) * 100);
              
              return (
                <div key={category.id} className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        {category.category}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryProgress}/{category.items.length} items
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {categoryPercentage}%
                      </span>
                      <button
                        onClick={() => handleCategoryToggle(category.id, categoryProgress < category.items.length)}
                        className="px-3 py-1 text-xs bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white rounded-full hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {categoryProgress === category.items.length ? 'Uncheck All' : 'Check All'}
                      </button>
                    </div>
                  </div>

                  {/* Category Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${categoryPercentage}%` }}
                    ></div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="border border-black dark:border-purple-500 rounded-lg overflow-hidden bg-amber-50 dark:bg-black">
                        <div className="flex items-center space-x-3 p-3 hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors">
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={userChecklist[item.id] || false}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                            className="w-5 h-5 text-purple-600 bg-amber-50 dark:bg-black border-black dark:border-purple-500 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2"
                          />
                          <label 
                            htmlFor={item.id}
                            className={`flex-1 text-sm font-medium cursor-pointer transition-colors ${
                              userChecklist[item.id] 
                                ? 'text-green-600 dark:text-green-400 line-through' 
                                : 'text-black dark:text-white'
                            }`}
                          >
                            {item.text}
                          </label>
                          {item.examples && (
                            <button
                              onClick={() => toggleDropdown(item.id)}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                            >
                              <svg
                                className={`w-5 h-5 transform transition-transform ${expandedItems[item.id] ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        {/* Examples Dropdown */}
                        {item.examples && expandedItems[item.id] && (
                          <div className="px-6 pb-3 bg-amber-100 dark:bg-gray-800 border-t border-black dark:border-purple-500">
                            <div className="pt-3">
                              <h4 className="text-sm font-semibold text-black dark:text-white mb-2">
                                Instructions:
                              </h4>
                              <div className="space-y-2">
                                {item.examples.map((example, index) => (
                                  <div key={index} className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 p-3 rounded border-l-4 border-purple-500">
                                    <code className="text-sm text-black dark:text-white font-mono whitespace-pre-wrap">
                                      {example}
                                    </code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Keep track of your progress as you secure your system for CyberPatriot!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This checklist covers essential security hardening steps for both Windows and Linux systems.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your progress is automatically saved and will be available when you return.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
            {error.message || 'Something went wrong while saving your progress.'}
          </div>
        )}
      </div>
    </div>
  );
}
