import Rating from './Rating';
import { Link } from 'react-router-dom';

export default function UserCard({ user, title }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {title && <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>}
        
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-indigo-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{user.name}</h4>
            <Rating value={user.rating || 4.5} />
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills?.map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <Link 
          to={`/profile/${user._id}`}
          className="inline-block w-full text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}