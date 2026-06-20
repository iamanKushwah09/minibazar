import React from "react";
import { HashLoader } from "react-spinners";

const ThemeSuspense = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <div className="flex flex-col items-center gap-4">
        <HashLoader color="#2563EB" size={50} />
        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default ThemeSuspense;
