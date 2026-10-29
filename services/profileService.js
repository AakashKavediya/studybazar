// services/profileService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL}";

// Get current user profile - handles BOTH response formats
export async function fetchUserProfile(accessToken) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        
        // ✅ SAFE GUARD: Handle both response formats
        // If the backend returns { user: {...} }, take user.
        // If the backend returns the user directly, take data.
        const userProfile = data.user || data;
        
        if (userProfile && (userProfile.id || userProfile._id)) {
            return userProfile;
        } else {
            console.warn("⚠️ User profile data was empty or invalid:", userProfile);
            return null;
        }
    } catch (error) {
        console.error("❌ Profile fetch error:", error);
        return null;
    }
}

// Update user profile
export async function updateUserProfile(accessToken, profileData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update profile");
    }
    
    const data = await response.json();
    return data.user || data;
}

// Update password
export async function updatePassword(accessToken, passwordData) {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update password");
    }
    
    return await response.json();
}

// Delete account
export async function deleteAccount(accessToken) {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to delete account");
    }
    
    return await response.json();
}


// services/profileService.js — append this
export async function googleLogin(idToken) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Google login failed");
  }

  return await response.json(); // { status, access_token }
}