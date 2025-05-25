import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { useMarkAllNotificationsAsRead } from "@/lib/react-query/queriesAndMutations/notifications";

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
  isActive = false,
  showNotificationsIndicator = false,
  showMessagesIndicator = false,
}) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: markAllnotificationsAsRead } =
    useMarkAllNotificationsAsRead();
  const [isHovered, setIsHovered] = useState(false);

  const hasIndicator = showNotificationsIndicator || showMessagesIndicator;

  return (
    <button
      className={`
        relative w-64 group overflow-hidden
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-primary-500/20"
            : "bg-white/80 backdrop-blur-sm border-gray-200/50 hover:border-primary-500/30"
        }
        border rounded-2xl shadow-sm hover:shadow-lg
        transform hover:scale-[1.02] hover:-translate-y-0.5
        active:scale-[0.98] active:translate-y-0
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (pagePath) navigate(pagePath);
        if (label === "Notifications") markAllnotificationsAsRead(user?.id);
      }}
    >
      <div
        className={`
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-r from-primary-500/5 to-transparent
        transition-opacity duration-300
      `}
      />
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full" />
      )}
      <div className="relative flex items-center gap-4 p-4">
        <div
          className={`
          relative flex items-center justify-center
          transition-all duration-300
          ${
            isActive
              ? "w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg"
              : "w-10 h-10  rounded-lg group-hover:bg-primary-50"
          }
        `}
        >
          <img
            src={
              logoUrl
                ? `/assets/icons/${logoUrl}.svg`
                : `/placeholder.svg?height=24&width=24`
            }
            alt={`${logoUrl} icon`}
            className={`
              transition-all duration-300
              ${isActive ? "w-6 h-6 brightness-0 invert" : "w-5 h-5 group-hover:scale-110"}
            `}
          />
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-md opacity-30 -z-10" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p
            className={`
            transition-all duration-300
            ${
              isActive
                ? "text-gray-900 font-bold text-lg"
                : "text-gray-700 font-semibold text-base group-hover:text-gray-900"
            }
          `}
          >
            {label}
          </p>
          <div
            className={`
            h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full
            transition-all duration-300 origin-left
            ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"}
          `}
          />
        </div>
        {hasIndicator && (
          <div className="relative">
            <div
              className={`
              w-3 h-3 rounded-full
              bg-gradient-to-br from-primary-500 to-primary-600
              shadow-lg shadow-primary-500/30
              transition-all duration-100
              ${isHovered ? "scale-110" : "scale-100"}
            `}
            >
              <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-30" />
            </div>

            <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary-500 blur-sm opacity-40" />
          </div>
        )}
      </div>
      <div
        className={`
        absolute inset-0 -translate-x-full group-hover:translate-x-full
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        transition-transform duration-700 ease-out
        ${isHovered ? "animate-shimmer" : ""}
      `}
      />
    </button>
  );
};
export default MenuItem;
