import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <div className="py-24 px-4 text-white z-10">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight text-gray-800 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] animate-fade-in">
          Swap Skills, Build Connections
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700 drop-shadow animate-fade-in delay-200 font-sans">
          Join a vibrant community to exchange skills and knowledge with others, fostering growth and collaboration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/tasks"
            className="bg-white/80 backdrop-blur-md text-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all animate-fade-in delay-400 font-sans"
          >
            Browse Tasks
          </Link>
          <Link
            to={user ? '/tasks/new' : '/login'}
            className={`px-8 py-4 rounded-lg font-semibold text-lg ${
              user
                ? 'bg-indigo-600/80 backdrop-blur-md text-white hover:bg-indigo-700/90 hover:shadow-indigo-500/50'
                : 'bg-indigo-400/80 text-white cursor-not-allowed'
            } transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 animate-fade-in delay-600 font-sans`}
          >
            {user ? 'Post Your Skill' : 'Log in to Post a Skill'}
          </Link>
        </div>
      </div>
    </div>
  );
}