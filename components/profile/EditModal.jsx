// app/profile/components/EditModal.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import ModalHeader from "@/components/ui/ModalHeader";
import ActionButtons from "@/components/ui/ActionButtons";
import FormInput from "@/components/ui/FormInput"; // Ensure you import this
import FormTextarea from "@/components/ui/FormTextarea";
import FormSection from "@/components/ui/FormSection";
import SocialLinksInput from "./SocialLinksInput";

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
    social_links: { github: "", twitter: "", linkedin: "", website: "" },
  });

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value },
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const updateData = {
      name: formData.name,
      phone: formData.phone,
      campus: formData.campus,
      branch: formData.branch,
      year: formData.year ? parseInt(formData.year) : null,
      bio: formData.bio,
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      social_links: formData.social_links,
    };

    // Remove empty fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "" || updateData[key] === null) {
        delete updateData[key];
      }
    });

    onSave(updateData);
  }, [formData, onSave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5" onClick={onClose}>
      <div className="bg-[#161616] rounded-3xl max-w-[480px] w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title="Edit Profile" onClose={onClose} disabled={isLoading} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
          <FormInput
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          {/* 🔒 DISABLED EMAIL FIELD */}
          <FormInput
            type="email"
            placeholder="Email"
            value={userData?.email || ""}
            disabled
            readOnly
            className="bg-[#1A1A1A] text-[#666666] cursor-not-allowed opacity-50"
          />

          <FormInput
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />

          <FormInput
            type="text"
            name="campus"
            placeholder="College/University"
            value={formData.campus}
            onChange={handleChange}
            disabled={isLoading}
          />

          <FormInput
            type="text"
            name="branch"
            placeholder="Branch/Department"
            value={formData.branch}
            onChange={handleChange}
            disabled={isLoading}
          />

          <FormInput
            type="number"
            name="year"
            placeholder="Year (1-5)"
            value={formData.year}
            onChange={handleChange}
            disabled={isLoading}
            min="1"
            max="5"
          />

          <FormTextarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
          />

          <FormInput
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            disabled={isLoading}
          />

          <FormSection title="Social Links">
            <SocialLinksInput
              socialLinks={formData.social_links}
              onChange={handleSocialChange}
              disabled={isLoading}
            />
          </FormSection>

          <ActionButtons
            onCancel={onClose}
            isSubmitting={isLoading}
            submitText="Save Changes"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}