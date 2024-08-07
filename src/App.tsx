import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SignInForm from "./_auth/forms/SignInForm";
import { Home, CreatePost } from "./_root/pages";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <main>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>
        {/* Guarded routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />}>
            <Route path="create-post/:type" element={<CreatePost />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
