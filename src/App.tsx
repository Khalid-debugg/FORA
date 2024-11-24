import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SignInForm from "./_auth/forms/SignInForm";
import { Home, OneGamePost, OneNormalPost, Profile } from "./_root/pages";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

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
          <Route path="/normal-post/:id" element={<OneNormalPost />} />
          <Route path="/game-post/:id" element={<OneGamePost />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
