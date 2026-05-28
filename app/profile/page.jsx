"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";   

const ProfilePage = () => {
    return(
        <div>
            <Header />
            <div style={{ padding: "20px", textAlign: "center", color: COLORS.textPrimary }}>
                <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>My Profile</h1>
                <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
                    Manage your profile information and settings.
                </p>
            </div>
            <BottomTabNav />
        </div>
    )
}

export default ProfilePage;