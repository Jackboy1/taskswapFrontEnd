import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchTasks } from '../services/api';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'open',
    skill: '',
    sort: 'newest'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(filters);
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-12">Loading tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Tasks</h1>
        {user && (
          <button
            onClick={() => navigate('/tasks/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Post Your Skill
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <input
          type="text"
          name="skill"
          placeholder="Filter by skill"
          value={filters.skill}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />
        
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onViewDetails={() => navigate(`/tasks/${task._id}`)}
          />
        ))}
      </div>
    </div>
  );
}