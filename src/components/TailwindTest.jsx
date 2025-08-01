import React from "react";

function TailwindTest() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Tailwind Test</h2>

      {/* This should be a red grid with 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500 text-white p-4">Box 1</div>
        <div className="bg-red-500 text-white p-4">Box 2</div>
        <div className="bg-red-500 text-white p-4">Box 3</div>
      </div>
    </div>
  );
}

export default TailwindTest;