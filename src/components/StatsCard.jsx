const colors = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
  green: { bg: 'bg-green-100', text: 'text-green-800' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800' }
};

export default function StatsCard({ title, value, icon, color = 'blue', size = 'md' }) {
  const sizes = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg'
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className={`${sizes[size]}`}>
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${colors[color].bg} ${colors[color].text} mr-4`}>
            <span className="text-xl sm:text-2xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}