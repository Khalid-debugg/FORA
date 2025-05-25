"use client";

import type React from "react";

import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { useMarkAllNotificationsAsRead } from "@/lib/react-query/queriesAndMutations/notifications";

const BottomNavItem: React.FC<{
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
        relative flex-1 group overflow-hidden
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-gradient-to-t from-primary-500/10 via-primary-500/5 to-transparent"
            : "bg-white/80 backdrop-blur-sm hover:bg-primary-50/50"
        }
        transform hover:scale-[1.02] hover:-translate-y-1
        active:scale-[0.98] active:translate-y-0
        border-r border-gray-200/30 last:border-r-0
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
        bg-gradient-to-t from-primary-500/5 to-transparent
        transition-opacity duration-300
      `}
      />

      {isActive && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-b-full" />
      )}

      <div className="relative flex flex-col items-center justify-center p-4 gap-1">
        <div
          className={`
          relative flex items-center justify-center
          transition-all duration-300
          ${
            isActive
              ? "w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg"
              : "w-8 h-8 rounded-lg group-hover:bg-primary-50"
          }
        `}
        >
          <img
            src={
              logoUrl
                ? `/assets/icons/${logoUrl}.svg`
                : `/placeholder.svg?height=20&width=20`
            }
            alt={`${logoUrl} icon`}
            className={`
              transition-all duration-300
              ${isActive ? "w-5 h-5 brightness-0 invert" : "w-4 h-4 group-hover:scale-110"}
            `}
          />

          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-md opacity-30 -z-10" />
          )}

          {hasIndicator && (
            <div className="absolute -top-1 -right-1">
              <div
                className={`
                w-2.5 h-2.5 rounded-full
                bg-gradient-to-br from-primary-500 to-primary-600
                shadow-lg shadow-primary-500/30
                transition-all duration-100
                ${isHovered ? "scale-110" : "scale-100"}
              `}
              >
                <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-30" />
              </div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary-500 blur-sm opacity-40" />
            </div>
          )}
        </div>

        <p
          className={`
          text-xs font-medium transition-all duration-300
          ${isActive ? "text-primary-600 font-bold" : "text-gray-600 group-hover:text-gray-900"}
        `}
        >
          {label}
        </p>

        <div
          className={`
          h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full
          transition-all duration-300 origin-center
          ${isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60"}
        `}
        />
      </div>

      <div
        className={`
        absolute inset-0 -translate-y-full group-hover:translate-y-full
        bg-gradient-to-b from-transparent via-white/20 to-transparent
        transition-transform duration-700 ease-out
        ${isHovered ? "animate-shimmer" : ""}
      `}
      />
    </button>
  );
};

export default BottomNavItem;
