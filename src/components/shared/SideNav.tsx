import { useLocation, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import { useUserContext } from "@/context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { useDeleteSession } from "@/lib/react-query/queriesAndMutations/users";
const sideLinks = [
  { logoUrl: "home", label: "Home", path: "/" },
  { logoUrl: "mygames", label: "My Games" },
  { logoUrl: "search", label: "Explore", path: "/explore" },
  // { logoUrl: "chat", label: "Messages" },
  { logoUrl: "notifications", label: "Notifications", path: "/notifications" },
];
const SideNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: deleteSession, isPending } = useDeleteSession();
  const logout = () => {
    deleteSession();
    localStorage.clear();
    navigate("/signin");
  };
  console.log(user);

  return (
    <nav className="fixed top-0 left-0 w-1/3 max-w-1/3 h-screen hidden md:flex flex-col justify-between items-end py-5 px-7">
      <div className="flex flex-col gap-5">
        <button className="w-60 p-5" onClick={() => navigate("/")}>
          <header>
            <img
              src="/assets/brand-logo/svg/logo-no-background.svg"
              alt="FORA Logo"
              className="h-10"
            />
          </header>
        </button>
        <button
          className="w-56 flex items-center gap-3 p-4 "
          onClick={() => navigate(`/profile/${user?.id}`)}
        >
          {user?.imageUrl ? (
            <>
              <img
                src={user.imageUrl}
                alt="profile picture"
                className="h-12 w-12 rounded-full border border-black"
              />
              <p className="font-[500] text-lg">@{user.username}</p>
            </>
          ) : (
            <>
              <Skeleton className="h-12 w-12 rounded-full bg-gray-100" />
              <Skeleton className="h-8 w-32 rounded-full bg-gray-100" />
            </>
          )}
        </button>

        {sideLinks.map((link) => {
          return (
            <MenuItem
              logoUrl={link.logoUrl}
              label={link.label}
              pagePath={link.path}
              isActive={pathname === link.path}
              key={link.label}
            />
          );
        })}
      </div>
      <button
        onClick={logout}
        className="group flex justify-between w-56 p-4 rounded-2xl font-semibold shad-button_primary hover:shad-button_ghost transition-[background] 0.5s ease-in-out"
      >
        <p>Logout</p>
        <img
          src="/assets/icons/logout-white.svg"
          alt="logout"
          className="group-hover:hidden"
        />
        {isPending && <div className=" animate-spin">⚽</div>}
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          className="hidden group-hover:inline"
        />
      </button>
    </nav>
  );
};

export default SideNav;
