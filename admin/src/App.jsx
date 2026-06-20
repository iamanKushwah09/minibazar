import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import RouteLoader from "@/components/RouteLoader";
import AccessibleNavigationAnnouncer from "@/components/AccessibleNavigationAnnouncer";
import PrivateRoute from "@/components/login/PrivateRoute";
import ThemeSuspense from "@/components/theme/ThemeSuspense";
const Layout = lazy(() => import("@/layout/Layout"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgetPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <RouteLoader>
          <AccessibleNavigationAnnouncer />
          <Suspense fallback={<ThemeSuspense />}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgot-password" component={ForgetPassword} />
              <Route path="/reset-password/:token" component={ResetPassword} />
              <PrivateRoute>
                <Route path="/" component={Layout} />
              </PrivateRoute>
              <Redirect exact from="/" to="/login" />
            </Switch>
          </Suspense>
        </RouteLoader>
      </Router>
    </>
  );
};

export default App;
