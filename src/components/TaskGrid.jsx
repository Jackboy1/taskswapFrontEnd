import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

export default function TaskGrid({ title, tasks, error, initialLimit = 6 }) {
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        <div className="text-center text-gray-500">No tasks available.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.slice(0, initialLimit).map((task) => (
          <TaskCard 
            key={task._id} 
            task={task} 
          />
        ))}
      </div>
      
      {tasks.length > initialLimit && (
        <div className="mt-10 text-center">
          <Link
            to="/tasks"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View All Tasks
          </Link>
        </div>
      )}
    </div>
  );
}