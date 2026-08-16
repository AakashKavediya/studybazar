// components/sell/useImageUpload.js
"use client";

import { useState, useCallback } from "react";
import axios from "axios";

export const useImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Client-side preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Cloudinary Upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "study-mart"
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtdivzyct"
        }/image/upload`,
        uploadFormData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 }
      );

      return response.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload image. Please try again.");
      setPreview(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setUploadError(null);
  }, []);

  return { preview, isUploading, uploadError, handleImageUpload, handleRemoveImage };
};