import React from 'react';

const RatingStars = ({ rating }) => {
  const totalStars = 5;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-6 h-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.717 5.285a1 1 0 00.95.69h5.396c.969 0 1.372 1.24.588 1.81l-4.363 3.12a1 1 0 00-.364 1.118l1.717 5.285c.3.921-.755 1.688-1.538 1.118l-4.363-3.12a1 1 0 00-1.175 0l-4.363 3.12c-.783.57-1.838-.197-1.538-1.118l1.717-5.285a1 1 0 00-.364-1.118l-4.363-3.12c-.783-.57-.38-1.81.588-1.81h5.396a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
