// app/debug/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
    const [cookieData, setCookieData] = useState(null);

    useEffect(() => {
        const checkCookies = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/auth/debug-cookies",
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                setCookieData(data);
            } catch (error) {
                console.error("Debug error:", error);
            }
        };

        checkCookies();
    }, []);

    return (
        <div style={{ padding: "20px", backgroundColor: "#0A0A0A", color: "#F5F5F5" }}>
            <h1>Cookie Debug</h1>
            <pre>{JSON.stringify(cookieData, null, 2)}</pre>
        </div>
    );
}