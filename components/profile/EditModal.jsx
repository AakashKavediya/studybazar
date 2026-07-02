// app/profile/components/EditModal.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import ModalHeader from "@/components/ui/ModalHeader";
import ActionButtons from "@/components/ui/ActionButtons";
import ProfileFormFields from "@/components/profile/ProfileFormFields";

export default function EditModal({
  isOpen,
  onClose,
  userData,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    campus: "",
    branch: "",
    year: "",
    bio: "",
    skills: "",
    social_links: {
      github: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        campus: userData.campus || "",
        branch: userData.branch || "",
        year: userData.year || "",
        bio: userData.bio || "",
        skills: userData.skills?.join(", ") || "",
        social_links: {
          github: userData.social_links?.github || "",
          twitter: userData.social_links?.twitter || "",
          linkedin: userData.social_links?.linkedin || "",
          website: userData.social_links?.website || "",
        },
      });
    }
  }, [isOpen, userData]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle social link changes
  const handleSocialChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Prepare data for API
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        campus: formData.campus,
        branch: formData.branch,
        year: formData.year ? parseInt(formData.year) : null,
        bio: formData.bio,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter((s) => s)
          : [],
        social_links: formData.social_links,
      };

      // Remove empty/null fields
      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key] === "" ||
          updateData[key] === null ||
          updateData[key] === undefined
        ) {
          delete updateData[key];
        }
      });

      onSave(updateData);
    },
    [formData, onSave]
  );

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-[#161616] rounded-3xl max-w-[480px] w-full p-6 animate-scaleIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Edit Profile" onClose={handleClose} disabled={isLoading} />

        <form onSubmit={handleSubmit}>
          <ProfileFormFields
            formData={formData}
            userEmail={userData?.email || ""}
            onChange={handleChange}
            onSocialChange={handleSocialChange}
            disabled={isLoading}
          />

          <ActionButtons
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitText="Save Changes"
            disabled={isLoading}
          />
        </form>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        `}</style>
      </div>
    </div>
  );
}