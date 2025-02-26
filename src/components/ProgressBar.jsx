import React, { useState, useEffect } from "react";

const ProgressBar = ({ wordsReceived, wordsTotal }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (wordsTotal > 0) {
      setProgress((wordsReceived / wordsTotal) * 100);
    }
  }, [wordsReceived, wordsTotal]);

  return (
    <div className="flex items-center space-x-4 w-full mt-4 mb-4">
      {/* Progress Percentage Text */}
      <span className="text-lg font-bold text-gray-700 w-12 text-right">
        {Math.round(progress)}%
      </span>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-300 rounded-full h-6 shadow-inner relative">
        {/* Progress Bar Fill */}
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-500 shadow-md"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
