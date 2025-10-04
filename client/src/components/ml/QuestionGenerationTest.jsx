import { useState } from 'react';

export default function QuestionGenerationTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [additionalTags, setAdditionalTags] = useState(['generated', 'ai']);
  const [topic, setTopic] = useState('algorithms');
  const [difficulty, setDifficulty] = useState('medium');
  const [generationMode, setGenerationMode] = useState('single'); // single, multiple, batch
  const [batchConfig, setBatchConfig] = useState({
    totalQuestions: 5, // Start with small number for testing
    distribution: {
      bigIdea: { 
        1: 12,  // Creative Development (10-13%)
        2: 19,  // Data (17-22%) 
        3: 32,  // Algorithms & Programming (30-35%)
        4: 13,  // Computer Systems & Networks (11-15%)
        5: 24   // Impact of Computing (21-26%)
      },
      questionType: { 
        // robot_navigation: 50, // Commented out for now
        code_analysis: 40, 
        algorithm: 30, 
        data_structure: 20, 
        problem_solving: 10 
      },
      difficulty: { easy: 40, medium: 45, hard: 15 }
    }
  });

  const generateQuestion = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/question-generation/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          tags: additionalTags
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate question');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateMultiple = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/question-generation/generate-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: 3,
          topic,
          difficulty,
          tags: additionalTags
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate questions');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateBatch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/question-generation/generate-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalQuestions: batchConfig.totalQuestions,
          distribution: batchConfig.distribution,
          validationRules: {
            minValidationScore: 0.8,
            maxRetries: 3,
            qualityThreshold: 0.7
          },
          output: {
            format: 'database',
            includeQuestions: false,
            includeMetadata: true
          },
          tags: additionalTags
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate batch questions');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        🤖 AI Question Generation Test
      </h3>
      
      <div className="space-y-4">
        {/* Generation Mode */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            Generation Mode
          </label>
          <select
            value={generationMode}
            onChange={(e) => setGenerationMode(e.target.value)}
            className="w-full p-3 border border-black dark:border-purple-500 rounded-lg bg-amber-100 dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="single">Single Question</option>
            <option value="multiple">Multiple Questions (3)</option>
            <option value="batch">Batch Generation</option>
          </select>
        </div>

        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Additional Tags
            </label>
            <input
              type="text"
              value={additionalTags.join(', ')}
              onChange={(e) => setAdditionalTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
              className="w-full p-3 border border-black dark:border-purple-500 rounded-lg bg-amber-100 dark:bg-gray-800 text-black dark:text-white"
              placeholder="generated, ai, robot"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border border-black dark:border-purple-500 rounded-lg bg-amber-100 dark:bg-gray-800 text-black dark:text-white"
              disabled={generationMode === 'batch'}
            >
              <option value="algorithms">Algorithms</option>
              <option value="variables">Variables</option>
              <option value="functions">Functions</option>
              <option value="loops">Loops</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-black dark:border-purple-500 rounded-lg bg-amber-100 dark:bg-gray-800 text-black dark:text-white"
              disabled={generationMode === 'batch'}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Batch Configuration */}
        {generationMode === 'batch' && (
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-400 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Batch Configuration</h4>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Total Questions
              </label>
              <input
                type="number"
                value={batchConfig.totalQuestions}
                onChange={(e) => setBatchConfig({
                  ...batchConfig,
                  totalQuestions: parseInt(e.target.value)
                })}
                className="w-full p-2 border border-blue-400 rounded bg-white dark:bg-blue-800 text-black dark:text-white"
                min="1"
                max="100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                         Big Idea Distribution (%) - AP CSP Exam Weights
                       </label>
                       {Object.entries(batchConfig.distribution.bigIdea).map(([key, value]) => {
                         const bigIdeaNames = {
                           '1': 'Creative Dev (10-13%)',
                           '2': 'Data (17-22%)',
                           '3': 'Algorithms (30-35%)',
                           '4': 'Systems (11-15%)',
                           '5': 'Impact (21-26%)'
                         };
                         return (
                           <div key={key} className="flex items-center space-x-2 mb-1">
                             <span className="text-xs w-32">{bigIdeaNames[key]}:</span>
                             <input
                               type="number"
                               value={value}
                               onChange={(e) => setBatchConfig({
                                 ...batchConfig,
                                 distribution: {
                                   ...batchConfig.distribution,
                                   bigIdea: {
                                     ...batchConfig.distribution.bigIdea,
                                     [key]: parseInt(e.target.value)
                                   }
                                 }
                               })}
                               className="w-16 p-1 border border-blue-400 rounded text-xs"
                               min="0"
                               max="100"
                             />
                           </div>
                         );
                       })}
                       <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                         Based on official AP Computer Science Principles exam weights
                       </p>
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                         Question Type Distribution (%)
                       </label>
                       {Object.entries(batchConfig.distribution.questionType).map(([key, value]) => (
                         <div key={key} className="flex items-center space-x-2 mb-1">
                           <span className="text-xs w-20">{key.replace('_', ' ')}:</span>
                           <input
                             type="number"
                             value={value}
                             onChange={(e) => setBatchConfig({
                               ...batchConfig,
                               distribution: {
                                 ...batchConfig.distribution,
                                 questionType: {
                                   ...batchConfig.distribution.questionType,
                                   [key]: parseInt(e.target.value)
                                 }
                               }
                             })}
                             className="w-16 p-1 border border-blue-400 rounded text-xs"
                             min="0"
                             max="100"
                           />
                         </div>
                       ))}
                       <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                         Note: Robot navigation questions are temporarily disabled
                       </p>
                     </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Difficulty Distribution (%)
                </label>
                {Object.entries(batchConfig.distribution.difficulty).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2 mb-1">
                    <span className="text-xs w-12">{key}:</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setBatchConfig({
                        ...batchConfig,
                        distribution: {
                          ...batchConfig.distribution,
                          difficulty: {
                            ...batchConfig.distribution.difficulty,
                            [key]: parseInt(e.target.value)
                          }
                        }
                      })}
                      className="w-16 p-1 border border-blue-400 rounded text-xs"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {generationMode === 'single' && (
            <button
              onClick={generateQuestion}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate 1 Question'}
            </button>
          )}
          
          {generationMode === 'multiple' && (
            <button
              onClick={generateMultiple}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate 3 Questions'}
            </button>
          )}
          
          {generationMode === 'batch' && (
            <button
              onClick={generateBatch}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : `Generate ${batchConfig.totalQuestions} Questions`}
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-400 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Generation Successful
            </h4>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <p><strong>Message:</strong> {result.message}</p>
              {result.question && (
                <div>
                  <p><strong>Question ID:</strong> {result.question._id}</p>
                  <p><strong>Topic:</strong> {result.question.topic}</p>
                  <p><strong>Points:</strong> {result.question.points}</p>
                </div>
              )}
              {result.questions && (
                <div>
                  <p><strong>Generated:</strong> {result.questions.length} questions</p>
                  <p><strong>Question IDs:</strong> {result.questions.map(q => q._id).join(', ')}</p>
                </div>
              )}
              {result.totalGenerated && (
                <div>
                  <p><strong>Total Generated:</strong> {result.totalGenerated}/{result.totalRequested}</p>
                  <p><strong>Success Rate:</strong> {Math.round((result.totalGenerated / result.totalRequested) * 100)}%</p>
                  {result.distribution && (
                    <div className="mt-2">
                      <p><strong>Distribution:</strong></p>
                      <p className="text-xs">Big Ideas: {Object.entries(result.distribution.bigIdea).map(([k,v]) => `${k}:${v}`).join(', ')}</p>
                      <p className="text-xs">Types: {Object.entries(result.distribution.questionType).map(([k,v]) => `${k}:${v}`).join(', ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 border border-red-400 rounded-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ❌ Generation Failed
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* System Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-400 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🔧 System Features
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• ChatGPT API integration for question generation</li>
            <li>• Matrix-based robot simulation for validation</li>
            <li>• Automatic retry logic (up to 3 attempts)</li>
            <li>• Real-time validation of pseudocode</li>
            <li>• Database integration for saving questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
