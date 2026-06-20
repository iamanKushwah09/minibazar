import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';

export const AdminContext = createContext();

// Helper function to safely parse cookie
const getAdminInfoFromCookie = () => {
  try {
    const adminInfo = Cookies.get('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      // Validate that the parsed data has required fields
      if (parsed && parsed.token && parsed.email) {
        return parsed;
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing adminInfo cookie:', error);
    // Remove invalid cookie
    Cookies.remove('adminInfo');
    return null;
  }
};

const initialState = {
  adminInfo: getAdminInfoFromCookie(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, adminInfo: action.payload };

    case 'USER_LOGOUT':
      // Clear cookie when logging out
      Cookies.remove('adminInfo');
      return {
        ...state,
        adminInfo: null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
