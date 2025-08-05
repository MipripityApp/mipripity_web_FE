import React, { useState } from 'react';

const TestComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 m-4 border border-gray-300 rounded-md bg-white">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">React Test Component</h1>
      <p className="mb-4">This is a simple test component to verify that React is rendering correctly.</p>
      <p className="mb-4">Count: {count}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default TestComponent;