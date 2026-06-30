// app/profile/page.jsx
"use client";

import { useState, useMemo, useCallback } from "react";
import React from "react";
import ProtectedRoute from "../ProtectedRoute";
import Header from "../Header";
import BottomTabNav from "../BottomTabNav";
import ProfileHero from "./ProfileHero";
import ProfileInfo from "./ProfileInfo";
import ProfileProducts from "./ProfileProducts";
import SettingsSection from "./SettingsSection";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import PasswordModal from "./PasswordModal";

// Memoized components to prevent re-renders
const MemoizedProfileHero = React.memo(ProfileHero);
const MemoizedProfileInfo = React.memo(ProfileInfo);
const MemoizedProfileProducts = React.memo(ProfileProducts);
const MemoizedSettingsSection = React.memo(SettingsSection);

export default function Profile() {
  const [isOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => ({
    id: "1",
    name: "Aakash Kavediya",
    email: "aakash@university.edu",
    phone: "+91 98765 43210",
    college: "Indian Institute of Technology",
    branch: "Computer Science Engineering",
    year: "3rd Year",
    city: "Mumbai, India",
    bio: "Passionate about learning and sharing knowledge. I create study notes and resources for engineering students.",
    profilePicture: "https://i.pinimg.com/736x/7d/5d/4c/7d5d4cd7857e0496c83280d2e447f2c7.jpg",
    joinDate: "June 2026",
    stats: {
      products: 24,
      sold: 12,
      followers: 156,
      rating: 4.8,
    },
    productsListed: [
      { id: 1, title: "Data Structures Notes", price: "₹299", image: "https://i.pinimg.com/736x/e7/e5/44/e7e5446faff0d3dec1349dbf4806fe50.jpg" },
      { id: 2, title: "Algorithm Cheat Sheet", price: "₹199", image: "https://i.pinimg.com/736x/93/49/3e/93493e9666cd1a600cd214986e18c256.jpg" },
      { id: 3, title: "Python Programming Guide", price: "₹399", image: "https://i.pinimg.com/736x/bc/b1/d1/bcb1d1f579fb6a9ebde33e365ceed123.jpg" },
      { id: 4, title: "Machine Learning Basics", price: "₹499", image: "https://i.pinimg.com/1200x/98/13/74/98137436a171703977c5e9321dc2bac4.jpg" },
      { id: 5, title: "Database Management Notes", price: "₹349", image: "https://i.pinimg.com/736x/bf/23/db/bf23db07df26095a83cc081f77d94f2b.jpg" },
      { id: 6, title: "Web Development Course", price: "₹599", image: "https://i.pinimg.com/736x/3c/ef/0b/3cef0b0a61baa4210b33afc13b2a381e.jpg" },
    ],
    productsSold: [
      { id: 7, title: "JavaScript Handbook", price: "₹249", image: "https://i.pinimg.com/736x/7d/5d/4c/7d5d4cd7857e0496c83280d2e447f2c7.jpg" },
      { id: 8, title: "React Native Guide", price: "₹449", image: "https://i.pinimg.com/736x/93/49/3e/93493e9666cd1a600cd214986e18c256.jpg" },
    ],
    productsPurchased: [
      { id: 9, title: "Java Programming Book", price: "₹299", image: "https://i.pinimg.com/736x/7d/5d/4c/7d5d4cd7857e0496c83280d2e447f2c7.jpg" },
      { id: 10, title: "Data Science Course", price: "₹699", image: "https://i.pinimg.com/736x/93/49/3e/93493e9666cd1a600cd214986e18c256.jpg" },
    ],
  }), []);

  // Memoize callbacks
  const handleEditProfile = useCallback(() => setShowEditModal(true), []);
  const handleShareProfile = useCallback(() => console.log("Share profile"), []);
  const handleSaveProfile = useCallback((data) => console.log("Save profile:", data), []);
  const handleDeleteAccount = useCallback(() => { 
    console.log("Delete account"); 
    setShowDeleteModal(false); 
  }, []);
  const handleLogout = useCallback(() => console.log("Logout"), []);
  const handlePasswordUpdate = useCallback((data) => { 
    console.log("Update password:", data); 
    setShowPasswordModal(false); 
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
        <Header />
        <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10">
          <MemoizedProfileHero
            userData={userData}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            setIsFollowing={setIsFollowing}
            onEditClick={handleEditProfile}
            onShareClick={handleShareProfile}
          />

          <MemoizedProfileInfo userData={userData} bio={userData.bio} />

          <MemoizedProfileProducts
            productsListed={userData.productsListed}
            productsSold={userData.productsSold}
            productsPurchased={userData.productsPurchased}
            isOwnProfile={isOwnProfile}
          />

          {isOwnProfile && (
            <MemoizedSettingsSection
              onPasswordClick={() => setShowPasswordModal(true)}
              onDeleteClick={() => setShowDeleteModal(true)}
              onLogoutClick={handleLogout}
            />
          )}
        </div>

        <BottomTabNav />

        <EditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userData={userData}
          onSave={handleSaveProfile}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />

        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handlePasswordUpdate}
        />
      </div>
    </ProtectedRoute>
  );
}