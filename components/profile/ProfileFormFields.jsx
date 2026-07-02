// components/profile/ProfileFormFields.jsx
"use client";

import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import FormSection from "@/components/ui/FormSection";
import SocialLinksInput from "./SocialLinksInput";

export default function ProfileFormFields({
  formData,
  userEmail,
  onChange,
  onSocialChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <FormInput
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={onChange}
        disabled={disabled}
        required
      />

      <FormInput
        type="email"
        placeholder="Email"
        value={userEmail}
        disabled
        className="bg-[#1A1A1A] text-[#666666] cursor-not-allowed"
      />

      <FormInput
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={onChange}
        disabled={disabled}
      />

      <FormInput
        type="text"
        name="campus"
        placeholder="College/University"
        value={formData.campus}
        onChange={onChange}
        disabled={disabled}
      />

      <FormInput
        type="text"
        name="branch"
        placeholder="Branch/Department"
        value={formData.branch}
        onChange={onChange}
        disabled={disabled}
      />

      <FormInput
        type="number"
        name="year"
        placeholder="Year (1-5)"
        value={formData.year}
        onChange={onChange}
        disabled={disabled}
        min="1"
        max="5"
      />

      <FormTextarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={onChange}
        disabled={disabled}
        rows={3}
      />

      <FormInput
        type="text"
        name="skills"
        placeholder="Skills (comma separated: React, Python, ML)"
        value={formData.skills}
        onChange={onChange}
        disabled={disabled}
      />

      <FormSection title="Social Links">
        <SocialLinksInput
          socialLinks={formData.social_links}
          onChange={onSocialChange}
          disabled={disabled}
        />
      </FormSection>
    </div>
  );
}