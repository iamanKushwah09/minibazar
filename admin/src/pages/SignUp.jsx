import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Label, Button } from "@windmill/react-ui";
import { ImFacebook, ImGoogle } from "react-icons/im";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import OtpVerification from "@/components/OtpVerification";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SelectRole from "@/components/form/selectOption/SelectRole";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import ImageLight from "@/assets/img/create-account-office.jpeg";
import ImageDark from "@/assets/img/create-account-office-dark.jpeg";

const SignUp = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, setValue, errors, loading } =
    useLoginSubmit();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSignupSuccess = (data) => {
    if (data.requiresOtp) {
      setUserEmail(data.email);
      setShowOtpScreen(true);
    }
  };

  const handleOtpSuccess = (userData) => {
    // OTP verification successful, user will be auto-logged in
    // The useLoginSubmit hook will handle the redirect
  };

  const handleOtpCancel = () => {
    setShowOtpScreen(false);
    setUserEmail('');
  };

  // Show OTP verification screen if needed
  if (showOtpScreen) {
    return (
      <OtpVerification
        email={userEmail}
        onSuccess={handleOtpSuccess}
        onCancel={handleOtpCancel}
      />
    );
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                {t("CreateAccount")}
              </h1>
              <form onSubmit={handleSubmit((data) => onSubmit(data, handleSignupSuccess))}>
                <LabelArea label="Name" />
                <InputArea
                  required={true}
                  register={register}
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Admin"
                />
                <Error errorName={errors.name} />
                <LabelArea label="Email" />
                <InputArea
                  required={true}
                  register={register}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="john@doe.com"
                />
                <Error errorName={errors.email} />

                <LabelArea label="Password" />
                <div className="relative">
                  <InputArea
                    required={true}
                    register={register}
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autocomplete="current-password"
                    placeholder="***************"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <Error errorName={errors.password} />

                <LabelArea label="Staff Role" />
                <div className="col-span-8 sm:col-span-4">
                  <SelectRole register={register} label="Role" name="role" setValue={setValue} />
                  <Error errorName={errors.role} />
                </div>

                <Label className="mt-6" check>
                  <Input type="checkbox" />
                  <span className="ml-2">
                    {t("Iagree")}{" "}
                    <span className="underline">{t("privacyPolicy")}</span>
                  </span>
                </Label>

                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-4 h-12 w-full"
                  to="/dashboard"
                  block
                >
                  {t("CreateAccountTitle")}
                </Button>
              </form>

              <hr className="my-10" />

              <button
                disabled
                className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2"
              >
                <ImFacebook className="w-4 h-4 mr-2" />{" "}
                <span className="ml-2"> {t("LoginWithFacebook")} </span>
              </button>
              <button
                disabled
                className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2  md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
              >
                <ImGoogle className="w-4 h-4 mr-2" />{" "}
                <span className="ml-2">{t("LoginWithGoogle")}</span>
              </button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline"
                  to="/login"
                >
                  {t("AlreadyAccount")}
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
