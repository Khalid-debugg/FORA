// DropdownMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// DropdownMenu Component
export const DropdownMenu = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center px-4 py-2 bg-white rounded-md hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 flex flex-col divide-y divide-primary-500 bg-white border overflow-hidden border-primary-500 rounded-md shadow-lg z-50",
            "transition-all duration-200 ease-in-out",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// DropdownMenuItem Component
export const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
    >
      {children}
    </button>
  );
};
