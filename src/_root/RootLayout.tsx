import { Outlet } from "react-router-dom";
import { useHasNewNotifications } from "@/lib/react-query/queriesAndMutations/notifications";
import { useUserContext } from "@/context/AuthContext";
import { useHasNewMessages } from "@/lib/react-query/queriesAndMutations/messages";
import { lazy } from "react";
const TopNav = lazy(() => import("@/components/shared/TopNav"));
const BottomNav = lazy(() => import("@/components/shared/BottomNav"));
const SideNav = lazy(() => import("@/components/shared/SideNav"));
const AdditionalContent = lazy(
  () => import("@/components/shared/AdditionalContent/AdditionalContent"),
);
const RootLayout = () => {
  const { user } = useUserContext();
  const { data: hasNewNotifications } = useHasNewNotifications(user?.id);
  const { data: hasNewMessages } = useHasNewMessages(user?.id);

  return (
    <>
      <TopNav />
      <div className="flex md:flex-row flex-col min-h-screen md:divide-x divide-primary-500">
        <SideNav
          user={user}
          hasNewNotifications={hasNewNotifications}
          hasNewMessages={hasNewMessages}
        />
        <Outlet />
        <AdditionalContent />
      </div>
      <BottomNav
        user={user}
        hasNewNotifications={hasNewNotifications}
        hasNewMessages={hasNewMessages}
      />
    </>
  );
};

export default RootLayout;
