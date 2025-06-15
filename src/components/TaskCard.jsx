import { Link } from 'react-router-dom';

export default function TaskCard({ task, className = '', style }) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}
      style={style}
    >
      {task.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={task.image} 
            alt={task.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            task.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {task.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Offered Skill:</h4>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {task.offeredSkill}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Skills Needed:</h4>
          <div className="flex flex-wrap gap-2">
            {task.skillsNeeded.map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <Link 
          to={`/tasks/${task._id}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}