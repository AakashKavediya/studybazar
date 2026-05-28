// components/ui/Footer.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/constants/colors";

// iOS-style icons for footer
const HomeIcon = ({ active = false }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SellIcon = ({ active = false }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LostFoundIcon = ({ active = false }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const SearchIcon = ({ active = false }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ProfileIcon = ({ active = false }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    // Auto-hide footer on scroll for mobile
    const handleScroll = () => {
      if (!isMobile) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, lastScrollY]);

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/sell", label: "Sell", icon: SellIcon },
    { path: "/lost-found", label: "Lost", icon: LostFoundIcon },
    { path: "/search", label: "Search", icon: SearchIcon },
    { path: "/profile", label: "Profile", icon: ProfileIcon },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  // Don't render on desktop (only mobile)
  if (!isMobile) return null;

  return (
    <>
      <div className={`floating-footer-container ${isVisible ? "visible" : "hidden"}`}>
        <div className="floating-footer-island">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`footer-link ${active ? "active" : ""}`}
              >
                <div className="footer-icon-wrapper">
                  <Icon active={active} />
                  {active && <div className="active-indicator" />}
                </div>
                <span className="footer-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind footer */}
      <div className="footer-spacer" />

      <style jsx global>{`
        .floating-footer-container {
          position: fixed;
          bottom: 16px;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .floating-footer-container.visible {
          transform: translateY(0);
          opacity: 1;
        }
        
        .floating-footer-container.hidden {
          transform: translateY(100px);
          opacity: 0;
        }
        
        .floating-footer-island {
          pointer-events: auto;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 0.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 30px;
          padding: 8px 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 95%;
          max-width: 95vw;
        }
        
        .footer-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 6px 12px;
          border-radius: 20px;
          position: relative;
        }
        
        .footer-link:hover {
          transform: translateY(-2px);
        }
        
        .footer-link:active {
          transform: scale(0.95);
        }
        
        .footer-icon-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .footer-link svg {
          transition: all 0.2s ease;
        }
        
        .footer-link .footer-icon-wrapper svg {
          color: ${COLORS.textSecondary};
          stroke: ${COLORS.textSecondary};
        }
        
        .footer-link.active .footer-icon-wrapper svg {
          color: ${COLORS.primary};
          stroke: ${COLORS.primary};
        }
        
        .active-indicator {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background: ${COLORS.primary};
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .footer-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: -0.2px;
          transition: all 0.2s ease;
          font-family: -apple-system, 'SF Pro Text', system-ui;
        }
        
        .footer-link .footer-label {
          color: ${COLORS.textSecondary};
        }
        
        .footer-link.active .footer-label {
          color: ${COLORS.primary};
        }
        
        .footer-spacer {
          height: 80px;
          display: block;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translateX(-50%) scale(0.8);
          }
        }
        
        /* iPhone Notch and Home Indicator Support */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .floating-footer-container {
            bottom: calc(16px + env(safe-area-inset-bottom));
          }
          
          .footer-spacer {
            height: calc(80px + env(safe-area-inset-bottom));
          }
        }
        
        /* Small phones */
        @media (max-width: 480px) {
          .floating-footer-island {
            padding: 6px 16px;
            gap: 12px;
            min-width: 240px;
          }
          
          .footer-link {
            padding: 4px 8px;
          }
          
          .footer-label {
            font-size: 9px;
          }
          
          .footer-link svg {
            width: 20px;
            height: 20px;
          }
          
          .active-indicator {
            bottom: -6px;
            width: 3px;
            height: 3px;
          }
        }
        
        /* Very small devices */
        @media (max-width: 380px) {
          .floating-footer-island {
            padding: 5px 12px;
            gap: 8px;
            min-width: 200px;
          }
          
          .footer-link {
            padding: 3px 6px;
          }
          
          .footer-label {
            font-size: 8px;
          }
          
          .footer-link svg {
            width: 18px;
            height: 18px;
          }
        }
        
        /* Tablet landscape */
        @media (min-width: 768px) and (max-width: 1024px) {
          .floating-footer-island {
            max-width: 500px;
            padding: 10px 24px;
            gap: 30px;
          }
          
          .footer-label {
            font-size: 11px;
          }
        }
        
        /* Haptic feedback simulation */
        @media (hover: none) and (pointer: coarse) {
          .footer-link:active {
            transform: scale(0.92);
            background: rgba(255, 255, 255, 0.05);
          }
        }
        
        /* Smooth entrance animation */
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .floating-footer-container {
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </>
  );
}