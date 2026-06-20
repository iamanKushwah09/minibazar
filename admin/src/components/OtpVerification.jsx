import React, { useState, useEffect, useRef } from "react";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { handleOtpVerification } from "@/hooks/useLoginSubmit";

const OtpVerification = ({ email, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      notifyError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await AdminServices.verifyOtp({
        email,
        otp: otpString,
        type: 'signup'
      });

      if (response) {
        notifySuccess("Email verified successfully!");
        // Auto-login the user after successful OTP verification
        handleOtpVerification(response, dispatch, history);
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await AdminServices.sendOtp({
        email,
        type: 'signup'
      });
      notifySuccess("OTP sent to your email!");
      setResendTimer(30);
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              ))}
            </div>

            <Button
              disabled={loading || otp.some(digit => !digit)}
              type="submit"
              className="w-full h-12 mb-4"
              block
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || resendLoading}
                className={`text-sm font-medium ${
                  resendTimer > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                {resendLoading
                  ? "Sending..."
                  : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend OTP"
                }
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Change Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;