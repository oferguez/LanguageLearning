import React, { useState, useEffect } from "react";

const ProgressBar = ({ wordsReceived, wordsTotal }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (wordsTotal > 0) {
      setProgress((wordsReceived / wordsTotal) * 100);
    }
  }, [wordsReceived, wordsTotal]);

  return (
    <div className="w-full bg-gray-300 rounded mt-4 mb-4">
      <div
        className="bg-blue-600 h-4 rounded transition-all duration-200"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
