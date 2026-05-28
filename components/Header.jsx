// components/ui/Header.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/constants/colors";

// iOS-style icons (thinner, more elegant)
const HomeIcon = ({ active = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SellIcon = ({ active = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LostFoundIcon = ({ active = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const SearchIcon = ({ active = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ProfileIcon = ({ active = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.8">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mobile header (only logo and name - NO navigation)
  if (isMobile) {
    return (
      <>
        <header className={`mobile-header ${isScrolled ? "scrolled" : ""}`}>
          <div className="mobile-container">
            <Link href="/" className="logo-section">
              <LogoIcon />
              <span className="logo-text">Study Bazaar</span>
            </Link>
          </div>
        </header>

        <style jsx global>{`
          .mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(20, 20, 20, 0.85);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            z-index: 100;
            transition: all 0.3s ease;
          }
          
          .mobile-header.scrolled {
            background: rgba(20, 20, 20, 0.95);
            border-bottom-color: rgba(255, 255, 255, 0.15);
          }
          
          .mobile-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 44px;
            padding-left: 15px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
          }
          
          .logo-text {
            font-size: 20px;
            font-weight: 600;
            color: ${COLORS.textPrimary};
            letter-spacing: -0.3px;
            font-family: -apple-system, 'SF Pro Display', system-ui;
          }
          
          body {
            padding-top: 60px;
          }
          
          /* iPhone notch support */
          @supports (padding-top: env(safe-area-inset-top)) {
            .mobile-header {
              padding-top: calc(8px + env(safe-area-inset-top));
            }
            
            body {
              padding-top: calc(60px + env(safe-area-inset-top));
            }
          }
        `}</style>
      </>
    );
  }

  // Desktop header with floating island design (full navigation visible)
  return (
    <>
      <div className={`floating-header-container ${isScrolled ? "scrolled" : ""}`}>
        <div className="floating-island">
          <Link href="/" className="logo-section">
            <LogoIcon />
            <span className="logo-text">Study Bazaar</span>
          </Link>
          
          <nav className="nav-items">
            <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
              <HomeIcon active={pathname === "/"} />
              <span className="nav-label">Home</span>
            </Link>
            <Link href="/sell" className={`nav-link ${pathname.startsWith("/sell") ? "active" : ""}`}>
              <SellIcon active={pathname.startsWith("/sell")} />
              <span className="nav-label">Sell</span>
            </Link>
            <Link href="/lost-found" className={`nav-link ${pathname.startsWith("/lost-found") ? "active" : ""}`}>
              <LostFoundIcon active={pathname.startsWith("/lost-found")} />
              <span className="nav-label">Lost</span>
            </Link>
            <Link href="/search" className={`nav-link ${pathname.startsWith("/search") ? "active" : ""}`}>
              <SearchIcon active={pathname.startsWith("/search")} />
              <span className="nav-label">Search</span>
            </Link>
            <Link href="/profile" className={`nav-link ${pathname.startsWith("/profile") ? "active" : ""}`}>
              <ProfileIcon active={pathname.startsWith("/profile")} />
              <span className="nav-label">Profile</span>
            </Link>
          </nav>
          
          <div className="header-actions">
            {/* Optional: Add notification or profile menu */}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .floating-header-container {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .floating-header-container.scrolled {
          top: 8px;
        }
        
        .floating-island {
          pointer-events: auto;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 0.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 30px;
          padding: 6px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .floating-header-container.scrolled .floating-island {
          padding: 5px 18px;
          background: rgba(20, 20, 20, 0.95);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .logo-section:hover {
          opacity: 0.8;
          transform: scale(0.98);
        }
        
        .logo-text {
          font-size: 18px;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          letter-spacing: -0.3px;
          font-family: -apple-system, 'SF Pro Display', system-ui;
        }
        
        .nav-items {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: ${COLORS.textSecondary};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 8px 12px;
          border-radius: 20px;
          position: relative;
          letter-spacing: -0.2px;
          font-family: -apple-system, 'SF Pro Text', system-ui;
        }
        
        .nav-link:hover {
          color: ${COLORS.primary};
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          color: ${COLORS.primary};
          background: rgba(245, 158, 11, 0.1);
        }
        
        .nav-label {
          font-size: 13px;
        }
        
        .header-actions {
          width: 30px;
        }
        
        body {
          padding-top: 80px;
        }
        
        @media (max-width: 768px) {
          .desktop-header {
            display: none;
          }
          
          body {
            padding-top: 0;
          }
        }
        
        @supports (padding-top: env(safe-area-inset-top)) {
          .floating-header-container {
            top: calc(16px + env(safe-area-inset-top));
          }
        }
        
        @keyframes slideIn {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}