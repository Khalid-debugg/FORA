import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useDeleteSession } from "@/lib/react-query/queriesAndMutations/users";
import { IUser } from "@/types";
import MenuItem from "./MenuItem";
const sideLinks = [
  { logoUrl: "home", label: "Home", path: "/" },
  { logoUrl: "chat", label: "Messages", path: "/messages" },
  { logoUrl: "search", label: "Explore", path: "/explore" },
  { logoUrl: "notifications", label: "Notifications", path: "/notifications" },
];
const SideNav = ({
  user,
  hasNewNotifications,
  hasNewMessages,
}: {
  user: IUser | undefined;
  hasNewNotifications: boolean;
  hasNewMessages: boolean;
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: deleteSession, isPending } = useDeleteSession();
  const logout = () => {
    deleteSession();
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <nav className="sticky top-0 left-0 w-1/3 max-w-1/3 h-screen hidden md:flex flex-col justify-between items-end py-5 px-7">
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
                className="h-12 w-12 rounded-full border border-primary-500"
                loading="lazy"
              />
              <div className="flex flex-col items-start">
                <p className="font-[600] text-lg">{user.name}</p>
                <p className="font-[300] text-lg text-gray-500">
                  @{user.username}
                </p>
              </div>
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
              showNotificationsIndicator={
                link.label === "Notifications" && hasNewNotifications
              }
              showMessagesIndicator={
                link.label === "Messages" && hasNewMessages
              }
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
          loading="lazy"
        />
        {isPending && <div className=" animate-spin">⚽</div>}
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          className="hidden group-hover:inline"
          loading="lazy"
        />
      </button>
    </nav>
  );
};

export default SideNav;
