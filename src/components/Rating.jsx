import { useState } from 'react';

function Star({ filled, half }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : half ? 'text-yellow-200' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      {half ? (
        <path d="M10 1l2.5 6.5H19l-5 4.5 2 6.5-6.5-4-6.5 4 2-6.5-5-4.5h6.5L10 1z" clipPath="inset(0 50% 0 0)" />
      ) : filled ? (
        <path d="M10 1l3 6.5H19l-5 4.5 2 6.5-6.5-4-6.5 4 2-6.5-5-4.5h6L10 1z" />
      ) : (
        <path d="M10 1l3 6.5H19l-5 4.5 2 6.5-6.5-4-6.5 4 2-6.5-5-4.5h6L10 1z" />
      )}
    </svg>
  );
}

export default function Rating({ value, onChange }) {
  const [rating, setRating] = useState(value || 0);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleClick = (newRating) => {
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <div className="flex items-center" role="radiogroup" aria-label="Rating">
      <div className="flex mr-1">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={starValue}
              onClick={() => handleClick(starValue)}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                filled={starValue <= fullStars}
                half={starValue === fullStars + 1 && hasHalfStar}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}