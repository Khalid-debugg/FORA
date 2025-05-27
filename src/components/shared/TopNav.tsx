import { useUserContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  return (
    <nav className="border-b-2 bg-white border-primary-500 shadow-lg flex items-center justify-between px-5 py-4 w-full md:hidden sticky top-0 z-[60]">
      <Link to={`/profile/${user.id}`}>
        <img
          src={user.imageUrl}
          alt="profile picture"
          className="h-12 rounded-full border border-black"
          loading="lazy"
        />
      </Link>
      <Link to="/">
        <header>
          <img
            src="/assets/brand-logo/svg/logo-no-background.svg"
            alt="FORA Logo"
            className="h-8 "
            loading="lazy"
          />
        </header>
      </Link>
      <button
        onClick={() => {
          localStorage.setItem("cookieFallback", "[]");
          navigate("/signin");
        }}
      >
        <img
          src="/assets/icons/logout.svg"
          className="h-10"
          alt="Logout icon"
          loading="lazy"
        />
      </button>
    </nav>
  );
};

export default NavBar;
