import TopNav from "@/components/shared/TopNav";
import BottomNav from "@/components/shared/BottomNav";
import SideNav from "@/components/shared/SideNav";
import { Outlet } from "react-router-dom";
import AdditionalContent from "@/components/shared/AdditionalContent/AdditionalContent";
import { useHasNewNotifications } from "@/lib/react-query/queriesAndMutations/notifications";
import { useUserContext } from "@/context/AuthContext";
import { useHasNewMessages } from "@/lib/react-query/queriesAndMutations/messages";

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
