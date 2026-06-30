// app/auth/verify-email/page.jsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Main component with the logic
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing verification token");
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("https://diplomatic-mindfulness-production-621b.up.railway.app/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
        } else {
          setError(data.message || data.detail || "Email verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.primary,
            borderRadius: "50%",
            margin: "0 auto 24px",
            animation: "spin 0.8s linear infinite"
          }} />
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "12px", color: COLORS.textPrimary }}>
            Verifying your email...
          </h2>
          <p style={{ color: COLORS.textSecondary }}>
            Please wait while we verify your email address.
          </p>
        </div>
      </Card>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Card>
        <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease", padding: "20px 0" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: COLORS.success, 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px" 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: COLORS.textPrimary }}>
            Email verified!
          </h2>
          <p style={{ color: COLORS.textSecondary, marginBottom: "8px" }}>
            Your email has been successfully verified.
          </p>
          {email && (
            <p style={{ color: COLORS.primary, fontWeight: "500", marginBottom: "28px" }}>
              {email}
            </p>
          )}
          <Link href="/auth/signin">
            <Button variant="primary">Continue to Sign In</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Error state
  return (
    <Card>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ 
          width: "64px", 
          height: "64px", 
          background: COLORS.error, 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 24px" 
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: COLORS.textPrimary }}>
          Verification failed
        </h2>
        <p style={{ color: COLORS.textSecondary, marginBottom: "28px" }}>
          {error || "Unable to verify your email. The link may be invalid or expired."}
        </p>
        <Link href="/auth/signup">
          <Button variant="secondary">Back to Sign Up</Button>
        </Link>
      </div>
    </Card>
  );
}

// Main exported component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        background: COLORS.background, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: COLORS.textPrimary,
        fontSize: "16px"
      }}>
        Loading...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

// Add global styles for animations
<style jsx global>{`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style>