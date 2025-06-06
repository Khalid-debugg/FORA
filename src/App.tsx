import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./globals.css";
const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((mod) => ({ default: mod.Toaster })),
);
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import Spinner from "./components/ui/loadingSpinner";
const SignInForm = lazy(() => import("./_auth/forms/SignInForm"));
const SignUpForm = lazy(() => import("./_auth/forms/SignUpForm"));
const ResetPassword = lazy(() => import("./_auth/forms/ResetPassword"));
const SetNewPassword = lazy(() => import("./_auth/forms/SetNewPassword"));
const Home = lazy(() => import("./_root/pages/Home/Home"));
const Profile = lazy(() => import("./_root/pages/Profile/Profile"));
const OneNormalPost = lazy(
  () => import("./_root/pages/NormalPost/OneNormalPost"),
);
const OneGamePost = lazy(() => import("./_root/pages/GamePost/OneGamePost"));
const Notifications = lazy(
  () => import("./_root/pages/Notifications/Notifications"),
);
const Explore = lazy(() => import("./_root/pages/Explore/Explore"));
const Messages = lazy(() => import("./_root/pages/Messages/Messages"));

export const LoadingSpinner = () => (
  <div className="h-64 flex flex-1 items-center justify-center">
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
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <SignInForm />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <SignUpForm />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/set-new-password/:userId?/:secret?"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <SetNewPassword />
              </Suspense>
            }
          />
        </Route>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/explore"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <Explore />
              </Suspense>
            }
          />
          <Route
            path="/normal-post/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <OneNormalPost />
              </Suspense>
            }
          />
          <Route
            path="/game-post/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <OneGamePost />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/notifications"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
                <Notifications />
              </Suspense>
            }
          />
          <Route
            path="/messages/:chatId?"
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center flex-1">
                    <Spinner />
                  </div>
                }
              >
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
