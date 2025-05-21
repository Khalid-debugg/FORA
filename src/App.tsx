import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const SignInForm = lazy(() => import("./_auth/forms/SignInForm"));
const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const ResetPassword = lazy(() => import("./_auth/forms/ResetPassword"));
const SetNewPassword = lazy(() => import("./_auth/forms/SetNewPassword"));
const AuthLayout = lazy(() => import("./_auth/AuthLayout"));
const RootLayout = lazy(() => import("./_root/RootLayout"));
import {
  Home,
  Profile,
  OneNormalPost,
  OneGamePost,
  Notifications,
  Explore,
  Messages,
} from "./_root/pages";

const App = () => {
  return (
    <main>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center text-4xl text-center animate-spin">
            ⚽
          </div>
        }
      >
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/set-new-password/:userId?/:secret?"
              element={<SetNewPassword />}
            />
          </Route>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/normal-post/:id" element={<OneNormalPost />} />
            <Route path="/game-post/:id" element={<OneGamePost />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages/:chatId?" element={<Messages />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </main>
  );
};

export default App;
