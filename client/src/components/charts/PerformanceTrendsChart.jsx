import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

PerformanceTrendsChart.propTypes = {
  data: PropTypes.shape({
    recentPerformance: PropTypes.arrayOf(PropTypes.shape({
      score: PropTypes.number.isRequired,
      quizTitle: PropTypes.string.isRequired,
      completedAt: PropTypes.string.isRequired,
      timeTaken: PropTypes.number.isRequired
    })),
    averageScore: PropTypes.number,
    totalQuizzes: PropTypes.number
  })
};

export default function PerformanceTrendsChart({ data }) {
  if (!data || !data.recentPerformance || data.recentPerformance.length === 0) {
    return (
      <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          📈 Performance Trends
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete more quizzes to see your performance trends
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.recentPerformance.map((_, index) => `Quiz ${index + 1}`),
    datasets: [
      {
        label: 'Score (%)',
        data: data.recentPerformance.map(attempt => attempt.score),
        borderColor: 'rgb(147, 51, 234)', // Purple-600
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
            const attempt = data.recentPerformance[context[0].dataIndex];
            return attempt.quizTitle;
          },
          label: function(context) {
            const attempt = data.recentPerformance[context.dataIndex];
            const date = new Date(attempt.completedAt).toLocaleDateString();
            return [
              `Score: ${context.parsed.y}%`,
              `Date: ${date}`,
              `Time: ${Math.floor(attempt.timeTaken / 60)}:${(attempt.timeTaken % 60).toString().padStart(2, '0')}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
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
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(147, 51, 234)'
      }
    }
  };

  // Calculate trend
  const scores = data.recentPerformance.map(attempt => attempt.score);
  const trend = scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;
  const trendText = trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '➡️ Stable';
  const trendColor = trend > 0 ? 'text-green-600 dark:text-green-400' : 
                     trend < 0 ? 'text-red-600 dark:text-red-400' : 
                     'text-gray-600 dark:text-gray-400';

  return (
    <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          📈 Performance Trends
        </h3>
        <div className={`text-sm font-medium ${trendColor}`}>
          {trendText} {trend !== 0 && `(${trend > 0 ? '+' : ''}${trend.toFixed(1)}%)`}
        </div>
      </div>
      
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.averageScore.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Average Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.max(...scores)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Best Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.totalQuizzes}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Quizzes</div>
        </div>
      </div>
    </div>
  );
}
