import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';

export default function Checklist() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  // AP Create Performance Task Checklist Items
  const checklistItems = [
    {
      id: 'program-purpose',
      category: 'Row 1 — Program Purpose & Function',
      items: [
        { 
          id: 'take-input', 
          text: 'Take input (input(), button click, sensor/file/api data, function parameter)', 
          weight: 1,
          examples: [
            'user_name = input("Enter your name: ")',
            'button_clicked = pygame.mouse.get_pressed()',
            'temperature = sensor.read_temperature()',
            'def process_data(data): # data is a parameter'
          ]
        },
        { 
          id: 'perform-processing', 
          text: 'Perform processing / decisions', 
          weight: 1,
          examples: [
            'if score > 100: level = "expert"',
            'total = sum(scores)',
            'average = total / len(scores)',
            'if user_input == "yes": proceed = True'
          ]
        },
        { 
          id: 'produce-output', 
          text: 'Produce output (print(), updating display, drawing graphics, writing to file, etc.)', 
          weight: 1,
          examples: [
            'print(f"Hello {user_name}!")',
            'screen.blit(player_image, (x, y))',
            'with open("results.txt", "w") as file: file.write(str(score))',
            'pygame.draw.circle(screen, RED, (100, 100), 50)'
          ]
        }
      ]
    },
    {
      id: 'data-abstraction',
      category: 'Row 2 — Data Abstraction (LIST)',
      items: [
        { 
          id: 'created-list', 
          text: 'I created a list (e.g. scores = [], names = ["Alice", "Bob"])', 
          weight: 1,
          examples: [
            'scores = []',
            'names = ["Alice", "Bob", "Charlie"]',
            'inventory = []',
            'high_scores = [100, 95, 87, 92]'
          ]
        },
        { 
          id: 'store-values', 
          text: 'I store values into it (via .append(), assignment, user input, file read, etc.)', 
          weight: 1,
          examples: [
            'scores.append(new_score)',
            'names[0] = "Alice Updated"',
            'inventory.extend(["sword", "shield"])',
            'scores = [int(x) for x in input().split()]'
          ]
        },
        { 
          id: 'use-values', 
          text: 'I use values from that list for decisions / calculations / output', 
          weight: 1,
          examples: [
            'if scores[0] > 100: print("High score!")',
            'total = sum(scores)',
            'print(f"Player: {names[i]}, Score: {scores[i]}")',
            'for item in inventory: print(f"You have: {item}")'
          ]
        }
      ]
    },
    {
      id: 'managing-complexity',
      category: 'Row 3 — Managing Complexity',
      items: [
        { 
          id: 'separate-variables', 
          text: 'Without the list, I would need separate variables for each item (e.g. item1, item2, item3)', 
          weight: 1,
          examples: [
            '# Instead of: score1, score2, score3, score4, score5',
            '# Use: scores = [100, 95, 87, 92, 78]',
            '# Instead of: name1, name2, name3',
            '# Use: names = ["Alice", "Bob", "Charlie"]'
          ]
        },
        { 
          id: 'easier-modify', 
          text: 'The list makes my program easier to modify or scale', 
          weight: 1,
          examples: [
            '# Easy to add more players: names.append("David")',
            '# Easy to handle any number: for name in names:',
            '# Easy to sort: scores.sort()',
            '# Easy to find max: highest = max(scores)'
          ]
        }
      ]
    },
    {
      id: 'procedural-abstraction',
      category: 'Row 4 — Procedural Abstraction (Python Function)',
      items: [
        { 
          id: 'defined-function', 
          text: 'I defined my own function using def', 
          weight: 1,
          examples: [
            'def calculate_average(scores):',
            'def find_winner(names, scores):',
            'def process_player_data(player_info):',
            'def update_inventory(item, inventory):'
          ]
        },
        { 
          id: 'has-parameter', 
          text: 'It has at least one parameter', 
          weight: 1,
          examples: [
            'def add_points(score, points): # score and points are parameters',
            'def greet_player(name): # name is a parameter',
            'def check_level(score): # score is a parameter',
            'def update_position(x, y): # x and y are parameters'
          ]
        },
        { 
          id: 'call-function', 
          text: 'I call the function somewhere else', 
          weight: 1,
          examples: [
            'player_score = add_points(player_score, 10)',
            'greet_player("Alice")',
            'current_level = check_level(player_score)',
            'new_x, new_y = update_position(x, y)'
          ]
        }
      ]
    },
    {
      id: 'algorithm-implementation',
      category: 'Row 5 — Algorithm (Inside That Function)',
      items: [
        { 
          id: 'sequencing', 
          text: 'Sequencing — normal ordered Python code', 
          weight: 1,
          examples: [
            'def find_winner(scores):',
            '    highest = 0  # Step 1',
            '    winner = ""  # Step 2',
            '    return winner  # Step 3'
          ]
        },
        { 
          id: 'selection', 
          text: 'Selection — if, elif, or else', 
          weight: 1,
          examples: [
            'if score > highest:',
            '    highest = score',
            'elif score == highest:',
            '    winner = "Tie"'
          ]
        },
        { 
          id: 'iteration', 
          text: 'Iteration — for or while', 
          weight: 1,
          examples: [
            'for name, score in scores.items():',
            'while score < 100:',
            'for i in range(len(names)):',
            'for item in inventory:'
          ]
        }
      ]
    },
    {
      id: 'testing',
      category: 'Row 6 — Testing Calls',
      items: [
        { 
          id: 'two-examples', 
          text: 'I can show two examples of calling my function with different arguments', 
          weight: 1,
          examples: [
            'print(find_winner({"Alice": 5, "Bob": 8}))  # → Bob',
            'print(find_winner({"Zoe": 10, "Max": 2}))   # → Zoe',
            'print(add_points(50, 25))  # → 75',
            'print(add_points(100, 10))  # → 110'
          ]
        },
        { 
          id: 'different-behavior', 
          text: 'Each call produces different behavior or output', 
          weight: 1,
          examples: [
            '# Different inputs produce different outputs:',
            'find_winner({"Alice": 5, "Bob": 8})  # Returns "Bob"',
            'find_winner({"Zoe": 10, "Max": 2})   # Returns "Zoe"',
            '# Function behaves differently based on input values'
          ]
        }
      ]
    }
  ];

  const [userChecklist, setUserChecklist] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalItems = checklistItems.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = Object.values(userChecklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  // Load user's checklist progress
  useEffect(() => {
    if (currentUser?.checklistProgress) {
      setUserChecklist(currentUser.checklistProgress);
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
          checklistProgress: updatedChecklist
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
    const category = checklistItems.find(cat => cat.id === categoryId);
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
          checklistProgress: updatedChecklist
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
        <div className="text-xl">Loading checklist...</div>
      </div>
    );
  }

  const progressPercentage = calculateProgress();

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              AP CSP Create Task — Python-Specific Rubric Checklist
            </span>
            AP CSP Create Task — Python-Specific Rubric Checklist
          </h1>
           <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-black dark:text-white">
                Your Progress
              </h2>
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
              Complete all items to finish your AP Create Performance Task
            </p>
          </div>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-6">
          {checklistItems.map((category) => {
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
                      className="px-3 py-1 text-xs bg-amber-50 dark:bg-black border border-black dark:border-purple-500 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#a855f7,0_0_15px_#a855f7,0_0_30px_#a855f7] text-black dark:text-white rounded-full hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
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
                              Examples:
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

        {/* Footer */}
         <div className="text-center mt-8 p-6 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Keep track of your progress as you work on your AP CSP Create Performance Task!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This checklist follows the official AP Computer Science Principles rubric for Python projects.
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
