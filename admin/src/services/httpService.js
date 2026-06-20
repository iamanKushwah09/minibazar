import axios from "axios";
import Cookies from "js-cookie";

// console.log("base url", import.meta.env.VITE_APP_API_BASE_URL);

const instance = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  timeout: 0,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Get admin info from cookie
    let adminInfo = null;
    try {
      const adminCookie = Cookies.get("adminInfo");
      if (adminCookie) {
        adminInfo = JSON.parse(adminCookie);
      }
    } catch (error) {
      console.error("🔐 Error parsing admin cookie:", error);
      Cookies.remove("adminInfo"); // Remove corrupted cookie
    }

    // Get company info from cookie
    let company = null;
    try {
      company = Cookies.get("company");
    } catch (error) {
      console.error("🔐 Error reading company cookie:", error);
    }

    // Set headers
    const headers = {
      ...config.headers,
      authorization: adminInfo?.token ? `Bearer ${adminInfo.token}` : null,
      company: company || null,
    };

    // Remove null headers
    Object.keys(headers).forEach(key => {
      if (headers[key] === null) {
        delete headers[key];
      }
    });

    return {
      ...config,
      headers,
    };
  },
  function (error) {
    console.error("🔐 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
instance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    console.error("🔐 HTTP Response Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🔐 Authentication error detected, clearing session...');

      // Clear all admin-related cookies and storage
      try {
        Cookies.remove("adminInfo", { path: '/' });
        Cookies.remove("globalSetting", { path: '/' });

        // Clear any admin-related cookies
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(cookieName => {
          if (cookieName.toLowerCase().includes('admin')) {
            Cookies.remove(cookieName, { path: '/' });
          }
        });

        // Clear localStorage
        if (typeof window !== 'undefined') {
          Object.keys(localStorage).forEach(key => {
            if (key.toLowerCase().includes('admin')) {
              localStorage.removeItem(key);
            }
          });
        }
      } catch (clearError) {
        console.error("🔐 Error clearing session data:", clearError);
      }

      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.log('🔐 Redirecting to login page...');
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body, config) => instance.post(url, body, config).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;
