import React from 'react';

const CycleSelector = ({ selectedCycles, onSelectCycles }) => {
  const cycleOptions = [3, 5, 7, 10];

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
        Select Cycle Count
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {cycleOptions.map((cycles) => (
          <button
            key={cycles}
            onClick={() => onSelectCycles(cycles)}
            className={`py-4 px-6 rounded-xl font-bold text-xl transition-all ${
              selectedCycles === cycles
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
            style={{ fontFamily: "'SF Pro Display', sans-serif" }}
          >
            {cycles}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CycleSelector;
