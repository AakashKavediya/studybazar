// app/profile/components/SettingsSection.jsx
"use client";

import { useMemo, useCallback, useState } from "react";
import { 
  FaLock, 
  FaBell, 
  FaShieldAlt, 
  FaQuestionCircle, 
  FaSignOutAlt, 
  FaTrashAlt,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";

function SettingsSection({ 
  onPasswordClick, 
  onDeleteClick, 
  onLogoutClick,
  isLoading = false 
}) {
  const [loadingAction, setLoadingAction] = useState(null);

  // Memoize settings items to prevent recreation on every render
  const settingsItems = useMemo(() => [
    { 
      id: "password", 
      icon: FaLock, 
      label: "Change Password", 
      onClick: onPasswordClick,
      description: "Update your password",
      destructive: false
    },
    { 
      id: "notifications", 
      icon: FaBell, 
      label: "Notifications", 
      onClick: () => {},
      description: "Manage notification preferences",
      destructive: false
    },
    { 
      id: "privacy", 
      icon: FaShieldAlt, 
      label: "Privacy", 
      onClick: () => {},
      description: "Control your privacy settings",
      destructive: false
    },
    { 
      id: "help", 
      icon: FaQuestionCircle, 
      label: "Help & Support", 
      onClick: () => {},
      description: "Get help or contact support",
      destructive: false
    },
  ], [onPasswordClick]);

  // Handle action with useCallback
  const handleAction = useCallback((actionId, onClick) => {
    if (isLoading || loadingAction) return;
    
    if (actionId === "logout" || actionId === "delete") {
      // For destructive actions, let the parent handle confirmation
      onClick();
    } else {
      setLoadingAction(actionId);
      onClick();
      // Reset loading state after a short delay (for non-destructive actions)
      setTimeout(() => setLoadingAction(null), 300);
    }
  }, [isLoading, loadingAction]);

  // Memoize destructive actions
  const destructiveActions = useMemo(() => [
    {
      id: "logout",
      icon: FaSignOutAlt,
      label: "Log Out",
      onClick: onLogoutClick,
      description: "Sign out of your account"
    },
    {
      id: "delete",
      icon: FaTrashAlt,
      label: "Delete Account",
      onClick: onDeleteClick,
      description: "Permanently delete your account"
    }
  ], [onLogoutClick, onDeleteClick]);

  // Memoize isLoading state for each action
  const isLoggingOut = useMemo(() => loadingAction === "logout", [loadingAction]);
  const isDeleting = useMemo(() => loadingAction === "delete", [loadingAction]);
  const isActionLoading = useMemo(() => loadingAction !== null, [loadingAction]);

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
      {/* Header */}
      <div className="px-5 sm:px-6 py-3 bg-[#111111] border-b border-[#262626] flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-[0.2em] text-[#A3A3A3] uppercase">
          Settings
        </span>
        <span className="text-[9px] text-[#A3A3A3] font-light">
          Account Management
        </span>
      </div>

      <div className="px-2 py-1">
        {/* Settings Items */}
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === settingsItems.length - 1;
          const isActive = loadingAction === item.id;
          const isDisabled = isLoading || isActive || isActionLoading;

          return (
            <button
              key={item.id}
              className={`flex items-center justify-between w-full px-3 py-3 text-left transition-all duration-200 hover:bg-[#1a1a1a] rounded-lg group ${
                !isLast ? 'border-b border-[#262626]' : ''
              } ${isActive ? 'bg-[#1a1a1a]' : ''}`}
              onClick={() => handleAction(item.id, item.onClick)}
              disabled={isDisabled}
              aria-label={`${item.label}: ${item.description}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-[#F5A623]/10' : 'bg-[#111111]'
                }`}>
                  <Icon size={15} className={isActive ? 'text-[#F5A623]' : 'text-[#A3A3A3]'} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] text-[#F5F5F5] font-light tracking-wide">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-[10px] text-[#666666] font-light truncate">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <FaSpinner size={12} className="text-[#F5A623] animate-spin" />
                ) : (
                  <FaChevronRight size={11} className="text-[#3A3A3A] group-hover:text-[#666666] transition-colors" />
                )}
              </div>
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-[#262626] my-1 mx-3" />

        {/* Destructive Actions (Logout & Delete) */}
        {destructiveActions.map((action) => {
          const Icon = action.icon;
          const isActive = loadingAction === action.id;
          const isDisabled = isLoading || isActive || isActionLoading;
          const isDanger = action.id === "delete";
          const colorClass = isDanger ? "text-[#FF3B30]" : "text-[#FF3B30]";
          const bgClass = isDanger ? "bg-[rgba(255,59,48,0.08)]" : "bg-[rgba(255,59,48,0.08)]";
          const hoverClass = isDanger ? "hover:bg-[rgba(255,59,48,0.12)]" : "hover:bg-[rgba(255,59,48,0.12)]";

          return (
            <button
              key={action.id}
              className={`flex items-center justify-between w-full px-3 py-3 text-left transition-all duration-200 ${hoverClass} rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => handleAction(action.id, action.onClick)}
              disabled={isDisabled}
              aria-label={`${action.label}: ${action.description}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgClass}`}>
                  {isActive ? (
                    <FaSpinner size={15} className={`${colorClass} animate-spin`} />
                  ) : (
                    <Icon size={15} className={colorClass} />
                  )}
                </div>
                <span className={`text-[13px] font-light tracking-wide ${colorClass}`}>
                  {isActive ? (
                    action.id === "logout" ? "Logging out..." : "Deleting..."
                  ) : (
                    action.label
                  )}
                </span>
              </div>
              {!isActive && (
                <FaChevronRight size={11} className="text-[#3A3A3A] group-hover:text-[#666666] transition-colors" />
              )}
            </button>
          );
        })}

        {/* Footer Info */}
        <div className="px-3 py-2 mt-1">
          <p className="text-[9px] text-[#444444] font-light text-center">
            Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;