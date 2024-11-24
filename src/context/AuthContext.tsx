import { getCurrentUser } from "@/lib/appwrite/Apis/users";
import { IContextType, IUser } from "@/types";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};
const AuthContext = createContext<IContextType>(INITIAL_STATE);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentRoute = useLocation();
  const navigate = useNavigate();
  const checkAuthUser = async () => {
    try {
      const currentAcc = await getCurrentUser();
      if (currentAcc) {
        setUser({
          id: currentAcc.$id,
          username: currentAcc.username,
          email: currentAcc.email,
          imageUrl: currentAcc.imageUrl,
          bio: currentAcc.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      (localStorage.getItem("cookieFallback") === "[]" ||
        localStorage.getItem("cookieFallback") === null) &&
      currentRoute.pathname !== "/signup"
    )
      navigate("/signin");
    checkAuthUser();
  }, []);
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
