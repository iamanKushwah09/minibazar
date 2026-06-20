import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-20">
      <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-200">404</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-4 text-xl">
        Page Not Found or You don't have permission to view this page.
      </p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        If you are an admin, please check if your user role has the required permissions in the database.
      </p>
    </div>
  );
};

export default NotFound;
