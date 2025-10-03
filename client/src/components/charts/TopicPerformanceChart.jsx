import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

TopicPerformanceChart.propTypes = {
  data: PropTypes.shape({
    topicPerformance: PropTypes.objectOf(PropTypes.shape({
      averageScore: PropTypes.number.isRequired,
      totalAttempts: PropTypes.number.isRequired,
      recentScores: PropTypes.arrayOf(PropTypes.number)
    }))
  })
};

export default function TopicPerformanceChart({ data }) {
  if (!data || !data.topicPerformance || Object.keys(data.topicPerformance).length === 0) {
    return (
      <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          📊 Performance by Topic
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-gray-600 dark:text-gray-400">
            Take quizzes on different topics to see your performance breakdown
          </p>
        </div>
      </div>
    );
  }

  const topics = Object.keys(data.topicPerformance);
  const scores = topics.map(topic => data.topicPerformance[topic].averageScore);

  // Color scheme for topics
  const colors = [
    'rgba(147, 51, 234, 0.8)',   // Purple
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Violet
    'rgba(34, 197, 94, 0.8)',    // Emerald
    'rgba(249, 115, 22, 0.8)',   // Orange
  ];

  const chartData = {
    labels: topics.map(topic => {
      // Format topic names for better display
      return topic.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }),
    datasets: [
      {
        label: 'Average Score (%)',
        data: scores,
        backgroundColor: colors.slice(0, topics.length),
        borderColor: colors.slice(0, topics.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const topic = topics[context.dataIndex];
            const topicData = data.topicPerformance[topic];
            return [
              `Average Score: ${context.parsed.y.toFixed(1)}%`,
              `Total Attempts: ${topicData.totalAttempts}`,
              `Best Score: ${Math.max(...topicData.recentScores || [topicData.averageScore]).toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          maxRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Find best and worst performing topics
  const bestTopic = topics.reduce((best, topic) => 
    data.topicPerformance[topic].averageScore > data.topicPerformance[best].averageScore ? topic : best
  );
  const worstTopic = topics.reduce((worst, topic) => 
    data.topicPerformance[topic].averageScore < data.topicPerformance[worst].averageScore ? topic : worst
  );

  return (
    <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        📊 Performance by Topic
      </h3>
      
      <div className="h-64 mb-4">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900 border border-green-400 rounded-lg p-3">
          <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            🏆 Best Topic
          </div>
          <div className="text-lg font-bold text-green-900 dark:text-green-100">
            {bestTopic.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            {data.topicPerformance[bestTopic].averageScore.toFixed(1)}% average
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900 border border-amber-400 rounded-lg p-3">
          <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
            📚 Focus Area
          </div>
          <div className="text-lg font-bold text-amber-900 dark:text-amber-100">
            {worstTopic.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
          <div className="text-sm text-amber-700 dark:text-amber-300">
            {data.topicPerformance[worstTopic].averageScore.toFixed(1)}% average
          </div>
        </div>
      </div>
    </div>
  );
}
