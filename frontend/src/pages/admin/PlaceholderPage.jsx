import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md">
        This module is currently under development. We're working hard to bring you the best experience.
      </p>
      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default PlaceholderPage;
