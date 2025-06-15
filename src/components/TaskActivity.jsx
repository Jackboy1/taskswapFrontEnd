import { useState, useEffect } from 'react';
import { fetchTasksByUser } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function TaskActivity({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setError(null);
        const tasksData = await fetchTasksByUser(userId);
        setTasks(tasksData);
      } catch (error) {
        setError('Failed to load task activity. Please try again.');
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Task Activity</h2>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't posted any tasks yet
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.status} • {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {task.skillsNeeded?.map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}