import { useLocation } from "react-router-dom";
import type { IUser } from "@/types";
import BottomNavItem from "./BottomNavItem";

const bottomLinks = [
  { logoUrl: "home", label: "Home", path: "/" },
  { logoUrl: "chat", label: "Messages", path: "/messages" },
  { logoUrl: "notifications", label: "Notifications", path: "/notifications" },
  { logoUrl: "search", label: "Explore", path: "/explore" },
];

const BottomNav = ({
  user,
  hasNewNotifications,
  hasNewMessages,
}: {
  user: IUser | undefined;
  hasNewNotifications: boolean;
  hasNewMessages: boolean;
}) => {
  const { pathname } = useLocation();

  return (
    <nav
      className="
      sticky bottom-0 left-0 right-0 z-[60]
      bg-white/95 backdrop-blur-lg border-t border-gray-200/50
      shadow-lg shadow-gray-900/5
      md:hidden
    "
    >
      <div className="flex items-center justify-center w-full">
        {bottomLinks.map((link) => (
          <BottomNavItem
            key={link.label}
            logoUrl={link.logoUrl}
            label={link.label}
            pagePath={link.path}
            isActive={pathname === link.path}
            showNotificationsIndicator={
              link.label === "Notifications" && hasNewNotifications
            }
            showMessagesIndicator={link.label === "Messages" && hasNewMessages}
          />
        ))}
      </div>

      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </nav>
  );
};

export default BottomNav;
