import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

const SignInForm = lazy(() => import("./_auth/forms/SignInForm"));
const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const ResetPassword = lazy(() => import("./_auth/forms/ResetPassword"));
const SetNewPassword = lazy(() => import("./_auth/forms/SetNewPassword"));

import Home from "./_root/pages/Home/Home";
import Profile from "./_root/pages/Profile/Profile";
import OneNormalPost from "./_root/pages/NormalPost/OneNormalPost";
import OneGamePost from "./_root/pages/GamePost/OneGamePost";
import Notifications from "./_root/pages/Notifications/Notifications";
import Explore from "./_root/pages/Explore/Explore";
import Messages from "./_root/pages/Messages/Messages";

const LoadingSpinner = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="text-4xl animate-spin">⚽</div>
  </div>
);

const App = () => {
  return (
    <main>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/signin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SignInForm />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SignUpForm />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/set-new-password/:userId?/:secret?"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SetNewPassword />
              </Suspense>
            }
          />
        </Route>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/explore"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Explore />
              </Suspense>
            }
          />
          <Route
            path="/normal-post/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <OneNormalPost />
              </Suspense>
            }
          />
          <Route
            path="/game-post/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <OneGamePost />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/notifications"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Notifications />
              </Suspense>
            }
          />
          <Route
            path="/messages/:chatId?"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Messages />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
