import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SignInForm from "./_auth/forms/SignInForm";
import {
  Home,
  OneGamePost,
  OneNormalPost,
  Profile,
  Notifications,
  Explore,
} from "./_root/pages";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import Messages from "./_root/pages/Messages/Messages";

const App = () => {
  return (
    <main>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/normal-post/:id" element={<OneNormalPost />} />
          <Route path="/game-post/:id" element={<OneGamePost />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
