import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

//internal import
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { removeSetting } from "@/reduxStore/slice/settingSlice";

const useLoginSubmit = () => {
  const reduxDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ name, email, verifyEmail, password, role }, onSuccess) => {
    setLoading(true);

    // Get session configuration from environment or use defaults
    const cookieTimeOut = parseInt(import.meta.env.VITE_APP_SESSION_TIMEOUT) || 1; // 1 day default
    const isSecure = import.meta.env.VITE_APP_COOKIE_SECURE === 'true' || window.location.protocol === 'https:';
    const sameSite = import.meta.env.VITE_APP_COOKIE_SAME_SITE || 'Lax';

    if (location.pathname === "/login") {
      // Clear any existing session data
      reduxDispatch(removeSetting("globalSetting"));
      Cookies.remove("adminInfo");

      console.log("🔐 Attempting admin login for:", email);

      AdminServices.loginAdmin({ email, password })
        .then((res) => {
          console.log("🔐 Login response received:", res);

          if (res && res.token && res.email) {
            setLoading(false);
            notifySuccess("Login Success!");

            // Validate response data
            const adminData = {
              token: res.token,
              _id: res._id,
              name: res.name,
              phone: res.phone,
              email: res.email,
              image: res.image,
              permission: res.permission || [],
              salesman_id:res.salesman_id ?? null
            };

            console.log("🔐 Setting admin cookie with data:", adminData);

            // Set cookie with improved settings
            Cookies.set("adminInfo", JSON.stringify(adminData), {
              expires: cookieTimeOut,
              sameSite: sameSite,
              secure: isSecure,
              path: '/' // Ensure cookie is available site-wide
            });

            // Verify cookie was set
            const cookieCheck = Cookies.get("adminInfo");
            if (cookieCheck) {
              console.log("🔐 Cookie set successfully");

              // Dispatch to context after cookie is confirmed
              dispatch({ type: "USER_LOGIN", payload: adminData });

              // Redirect to dashboard
              setTimeout(() => {
                history.replace("/");
              }, 100);
            } else {
              console.error("🔐 Failed to set cookie");
              notifyError("Session setup failed. Please try again.");
              setLoading(false);
            }
          } else {
            console.error("🔐 Invalid response structure:", res);
            setLoading(false);
            notifyError("Invalid response from server. Please check your credentials.");
          }
        })
        .catch((err) => {
          console.error("🔐 Login error:", err);
          const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
          notifyError(errorMessage);
          setLoading(false);
        });
    }

    if (location.pathname === "/signup") {
      AdminServices.registerAdmin({ name, email, password, role })
        .then((res) => {
          setLoading(false);
          if (res && res.requiresOtp) {
            // OTP verification required - handled by SignUp component
            if (onSuccess) onSuccess(res);
          } else if (res && res.token && res.email) {
            // Legacy flow - direct login (shouldn't happen with new implementation)
            notifySuccess("Register Success!");
            dispatch({ type: "USER_LOGIN", payload: res });
            setTimeout(() => {
              history.replace("/");
            }, 100);
          } else {
            notifyError("Invalid response from server");
          }
        })
        .catch((err) => {
          notifyError(err?.response?.data?.message || err?.message || "Registration failed");
          setLoading(false);
        });
    }

    if (location.pathname === "/forgot-password") {
      AdminServices.forgetPassword({ verifyEmail })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err?.response?.data?.message || err?.message || "Password reset failed");
        });
    }
  };
  
  return {
    onSubmit,
    register,
    handleSubmit,
    setValue,
    errors,
    loading,
  };
};

// Separate function for OTP verification and auto-login
export const handleOtpVerification = (userData, dispatch, history) => {
  // Get session configuration from environment or use defaults
  const cookieTimeOut = parseInt(import.meta.env.VITE_APP_SESSION_TIMEOUT) || 1; // 1 day default
  const isSecure = import.meta.env.VITE_APP_COOKIE_SECURE === 'true' || window.location.protocol === 'https:';
  const sameSite = import.meta.env.VITE_APP_COOKIE_SAME_SITE || 'Lax';

  // Set cookie with improved settings
  Cookies.set("adminInfo", JSON.stringify(userData), {
    expires: cookieTimeOut,
    sameSite: sameSite,
    secure: isSecure,
    path: '/' // Ensure cookie is available site-wide
  });

  // Dispatch to context
  dispatch({ type: "USER_LOGIN", payload: userData });

  // Redirect to dashboard
  setTimeout(() => {
    history.replace("/");
  }, 100);
};


export default useLoginSubmit;
