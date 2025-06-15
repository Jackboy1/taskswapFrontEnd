import { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { fetchTasks } from '../services/api';

export default function Stats() {
  const [stats, setStats] = useState({
    completedTasks: 0,
    activeUsers: 0,
    positiveFeedback: 0,
    sharedSkills: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const tasks = await fetchTasks();
        setStats({
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          activeUsers: new Set(tasks.map(t => t.createdBy._id)).size, // Approximate active users
          positiveFeedback: 95, 
          sharedSkills: new Set(tasks.flatMap(t => t.skillsNeeded)).size 
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Our Impact</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard title="Tasks Completed" value={stats.completedTasks} icon="✅" color="green" />
          <StatsCard title="Active Users" value={stats.activeUsers} icon="👥" color="blue" />
          <StatsCard title="Positive Feedback" value={`${stats.positiveFeedback}%`} icon="⭐" color="yellow" />
          <StatsCard title="Skills Shared" value={stats.sharedSkills} icon="🎓" color="purple" />
        </div>
      </div>
    </div>
  );
}