// lib/moderateImage.js
const MODERATION_URL =
  process.env.NEXT_PUBLIC_MODERATION_URL || "http://localhost:8001";

export async function moderateImage(file, userEmail) {
  const formData = new FormData();
  formData.append("file", file);
  if (userEmail) formData.append("user_email", userEmail);

  try {
    const res = await fetch(`${MODERATION_URL}/moderate-image`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.status === 422) {
      // ✅ Blocked
      return {
        safe: false,
        reason: data.detail?.reason || "Inappropriate content detected.",
        extractedText: data.detail?.extracted_text,
      };
    }

    if (!res.ok) {
      throw new Error("Moderation service error");
    }

    return { safe: true };
  } catch (err) {
    console.error("Moderation error:", err);
    // If moderation service is down, we could either:
    // A. Block the upload (safer)
    // B. Allow the upload (more forgiving)
    // I'll choose to ALLOW but log the error
    return { safe: true, warning: "Moderation unavailable" };
  }
}