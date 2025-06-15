import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, getCurrentUser } from '../services/api';
import TaskActivity from '../components/TaskActivity';

export default function Profile() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    location: ''
  });
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const userData = await getCurrentUser();
          setFormData({
            name: userData.name || '',
            bio: userData.bio || '',
            skills: userData.skills?.join(', ') || '',
            location: userData.location || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!user) return <div>Please login to view profile</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <span className="text-3xl font-bold text-indigo-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-indigo-100">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills?.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-indigo-400 bg-opacity-20 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Activity
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'profile' ? (
            <>
              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                  Profile updated successfully!
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills (comma separated)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="React, Node.js, UI Design, Photography"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </>
          ) : (
            <TaskActivity userId={user._id} />
          )}
        </div>
      </div>
    </div>
  );
}