import React from 'react'

function ToggleSwitch({swEnabled, handleToggle}) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleToggle}
        className={`w-10 h-5 flex items-center rounded-full transition-colors duration-300 ${
          swEnabled ? "bg-green-400" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
            swEnabled ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );
}

export default ToggleSwitch