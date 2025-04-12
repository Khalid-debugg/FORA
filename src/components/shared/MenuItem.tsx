import { useUserContext } from "@/context/AuthContext";
import { useMarkAllNotificationsAsRead } from "@/lib/react-query/queriesAndMutations/notifications";
import { useNavigate } from "react-router-dom";
const MenuItem: React.FC<{
  logoUrl: string;
  label: string;
  pagePath?: string;
  isActive?: boolean;
  showNotificationsIndicator?: boolean;
  showMessagesIndicator?: boolean;
}> = ({
  logoUrl,
  label,
  pagePath,
  isActive,
  showNotificationsIndicator,
  showMessagesIndicator,
}) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: markAllnotificationsAsRead } =
    useMarkAllNotificationsAsRead();
  return (
    <button
      className={`relative w-56  hover:bg-gray-100 flex justify-start items-center gap-3 p-4 rounded-2xl ${isActive ? "bg-gray-100" : "bg-white"}`}
      onClick={() => {
        if (pagePath) navigate(pagePath);
        if (label === "Notifications") markAllnotificationsAsRead(user?.id);
      }}
    >
      <img
        src={`/assets/icons/${logoUrl}.svg`}
        alt={`${logoUrl}`}
        className={`${isActive ? "h-10" : "h-8"}`}
      />
      <p className={` ${isActive ? "font-bold" : "font-[500] text-lg"}`}>
        {label}
      </p>
      {(showNotificationsIndicator || showMessagesIndicator) && (
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
      )}
    </button>
  );
};

export default MenuItem;
