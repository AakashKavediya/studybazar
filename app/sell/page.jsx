"use client";
import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
const SellPage = () => {
    return (
        <div>
            <Header />
            <div style={{ padding: "20px", textAlign: "center", color: COLORS.textPrimary }}>
                <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Sell Your Books</h1>
                <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
                    List your used textbooks and study materials for sale. Reach thousands of students looking for affordable resources.
                </p>
            </div>
            <BottomTabNav />
        </div>
    )
}


export default SellPage;