import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import { Link } from 'react-router-dom';
import { fetchTasks } from '../services/api';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');
  const [stats, setStats] = useState({
    posted: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const taskData = await fetchTasks(); // Fetch real tasks
        setTasks(taskData);

        // Calculate stats based on fetched data
        setStats({
          posted: taskData.filter(t => t.createdBy._id === user._id).length,
          completed: taskData.filter(t => t.status === 'completed' && t.createdBy._id === user._id).length,
          pending: taskData.filter(t => t.status === 'pending' && t.createdBy._id === user._id).length
        });
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadTasks();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <div className="flex justify-center py-12"><LoadingSpinner /></div>;
  }

  if (!user) {
    return <div className="text-center py-12">Please log in to view your dashboard.</div>;
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'my-tasks') return task.createdBy._id === user._id;
    if (filter === 'available') return task.status === 'open';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Tasks Posted" 
          value={stats.posted} 
          icon="📝"
          color="blue"
        />
        <StatsCard 
          title="Swaps Completed" 
          value={stats.completed} 
          icon="✅"
          color="green"
        />
        <StatsCard 
          title="Pending Swaps" 
          value={stats.pending} 
          icon="⏳"
          color="yellow"
        />
      </div>

      {/* Task Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="available">Available Tasks</option>
            <option value="my-tasks">My Tasks</option>
            <option value="completed">Completed Swaps</option>
          </select>
        </div>
        
        <Link
          to="/tasks/new"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <span>+</span>
          <span className="ml-1">Create New Task</span>
        </Link>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">
            {filter === 'my-tasks' 
              ? "You haven't posted any tasks yet" 
              : "No tasks found matching your criteria"}
          </p>
          {filter !== 'my-tasks' && (
            <button 
              onClick={() => setFilter('my-tasks')}
              className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800"
            >
              View your tasks instead
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}