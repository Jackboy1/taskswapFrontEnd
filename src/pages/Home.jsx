import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import TaskGrid from '../components/TaskGrid';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import CTA from '../components/CTA';
import { fetchTasks } from '../services/api';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await fetchTasks();
        setTasks(taskData);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load tasks:', err);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", // Brighter workspace image
          }}
        />
        <div className="relative z-10 bg-gradient-to-b from-yellow-200/50 to-blue-300/50 backdrop-blur-sm">
          <HeroSection />
        </div>
      </div>

      {/* How It Works with Images */}
      <div className="relative py-16">
        <HowItWorks />
      </div>

      {/* Task Grid */}
      <div className="relative py-16 bg-gray-50">
        <TaskGrid
          title="Recently Posted Tasks"
          tasks={tasks}
          error={error}
          initialLimit={6}
        />
      </div>

      {/* Testimonials with Avatars */}
      <div className="relative py-16">
        <Testimonials />
      </div>

      {/* Stats */}
      <div className="relative py-16 bg-gray-50">
        <Stats />
      </div>

      {/* Call to Action with Gradient Overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-800 opacity-70" />
        <div className="relative z-10">
          <CTA />
        </div>
      </div>
    </div>
  );
}