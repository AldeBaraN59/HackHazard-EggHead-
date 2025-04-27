import React from 'react';

const Tags = ({ title, color }) => {
  return (
    <div
      className={`min-w-[80px] min-h-[80px] ${color} text-white rounded-md flex justify-center items-center p-[20px] text-sm text-center`}
    >
      {title}
    </div>
  );
};

export default Tags;
