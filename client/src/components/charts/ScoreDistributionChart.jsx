import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

ScoreDistributionChart.propTypes = {
  data: PropTypes.shape({
    recentPerformance: PropTypes.arrayOf(PropTypes.shape({
      score: PropTypes.number.isRequired
    }))
  })
};

export default function ScoreDistributionChart({ data }) {
  if (!data || !data.recentPerformance || data.recentPerformance.length === 0) {
    return (
      <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          🎯 Score Distribution
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete quizzes to see your score distribution
          </p>
        </div>
      </div>
    );
  }

  // Calculate score distribution
  const scores = data.recentPerformance.map(attempt => attempt.score);
  const distribution = {
    'A (90-100%)': scores.filter(score => score >= 90).length,
    'B (80-89%)': scores.filter(score => score >= 80 && score < 90).length,
    'C (70-79%)': scores.filter(score => score >= 70 && score < 80).length,
    'D (60-69%)': scores.filter(score => score >= 60 && score < 70).length,
    'F (<60%)': scores.filter(score => score < 60).length
  };

  // Filter out empty categories
  const filteredDistribution = Object.entries(distribution).filter(([, count]) => count > 0);
  
  if (filteredDistribution.length === 0) {
    return (
      <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          🎯 Score Distribution
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete quizzes to see your score distribution
          </p>
        </div>
      </div>
    );
  }

  const labels = filteredDistribution.map(([grade]) => grade);
  const counts = filteredDistribution.map(([, count]) => count);

  // Color scheme for grades
  const gradeColors = {
    'A (90-100%)': 'rgba(34, 197, 94, 0.8)',   // Green
    'B (80-89%)': 'rgba(59, 130, 246, 0.8)',   // Blue
    'C (70-79%)': 'rgba(245, 158, 11, 0.8)',   // Yellow
    'D (60-69%)': 'rgba(249, 115, 22, 0.8)',   // Orange
    'F (<60%)': 'rgba(239, 68, 68, 0.8)',      // Red
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: labels.map(label => gradeColors[label]),
        borderColor: labels.map(label => gradeColors[label].replace('0.8', '1')),
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6b7280',
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
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
            const total = counts.reduce((sum, count) => sum + count, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.parsed} quiz${context.parsed !== 1 ? 'es' : ''} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  // Calculate statistics
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const mostCommonGrade = labels[counts.indexOf(Math.max(...counts))];

  return (
    <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        🎯 Score Distribution
      </h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="h-48 w-48">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-purple-50 dark:bg-purple-900 border border-purple-400 rounded-lg p-3">
          <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
            📊 Average Score
          </div>
          <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
            {averageScore.toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-400 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
            🏆 Most Common
          </div>
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {mostCommonGrade.split(' ')[0]}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            {counts[labels.indexOf(mostCommonGrade)]} quiz{counts[labels.indexOf(mostCommonGrade)] !== 1 ? 'es' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
