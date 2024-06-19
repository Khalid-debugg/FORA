import TopNav from "@/components/shared/TopNav";
import BottomNav from "@/components/shared/BottomNav";
import SideNav from "@/components/shared/SideNav";
import { Outlet } from "react-router-dom";
import AdditionalContent from "@/components/shared/AdditionalContent";

const RootLayout = () => {
  return (
    <>
      <TopNav />
      <div className="flex md:flex-row flex-col min-h-screen md:divide-x-2 divide-primary-500">
        <SideNav />
        <Outlet />
        <AdditionalContent />
      </div>
      <BottomNav />
    </>
  );
};

export default RootLayout;
