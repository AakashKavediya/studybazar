"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";

const LostPage = () => {
    return(
        <div>
            <Header />
            <div style={{ padding: "20px", textAlign: "center", color: COLORS.textPrimary }}>
                <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Report Lost Items</h1>
                <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
                    Have you lost an item? Report it here and help us locate it.
                </p>
            </div>
            <BottomTabNav />
        </div>
    )
}


export default LostPage;