// components/profile/SocialLinksInput.jsx
"use client";

import FormInput from "@/components/ui/FormInput";

export default function SocialLinksInput({ socialLinks, onChange, disabled = false }) {
  return (
    <div className="space-y-2">
      <FormInput
        type="url"
        name="website"
        placeholder="Website URL"
        value={socialLinks.website}
        onChange={onChange}
        disabled={disabled}
      />
      <FormInput
        type="url"
        name="github"
        placeholder="GitHub URL"
        value={socialLinks.github}
        onChange={onChange}
        disabled={disabled}
      />
      <FormInput
        type="url"
        name="twitter"
        placeholder="Twitter URL"
        value={socialLinks.twitter}
        onChange={onChange}
        disabled={disabled}
      />
      <FormInput
        type="url"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={socialLinks.linkedin}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}