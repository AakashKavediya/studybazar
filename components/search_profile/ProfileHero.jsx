"use client";

import { useMemo } from "react";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

import CornerBrackets from "@/components/ui/CornerBrackets";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import ProfileStats from "@/components/ui/ProfileStats";
import ProfileSkills from "@/components/ui/ProfileSkills";
import ProfileSocialLinks from "@/components/ui/ProfileSocialLinks";
import ProfileActions from "./ProfileActions";

export default function ProfileHero({
  userData,
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  onFollow,
  onMessage,
  onEditClick,
  onShareClick,
}) {
  const socialLinks = useMemo(() => {
    const links = [
      { icon: FaGlobe, label: "Website", url: userData.social_links?.website },
      { icon: FaTwitter, label: "Twitter", url: userData.social_links?.twitter },
      { icon: FaLinkedin, label: "LinkedIn", url: userData.social_links?.linkedin },
      { icon: FaGithub, label: "GitHub", url: userData.social_links?.github },
    ];
    return links.filter((link) => link.url && link.url !== "#" && link.url.trim() !== "");
  }, [userData.social_links]);

  const stats = useMemo(
    () => [
      { label: "Products", value: userData.products_sold_count || 0 },
      { label: "Sold", value: userData.active_listings_count || 0 },
      { label: "Followers", value: userData.followers_count || 0 },
    ],
    [userData]
  );

  const nameParts = useMemo(() => {
    const fullName = userData.name || "";
    const parts = fullName.split(" ");
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  }, [userData.name]);

  const location = useMemo(() => userData.campus || "Student", [userData.campus]);
  const role = useMemo(
    () => (userData.year ? `${userData.year} Year Student` : "Student"),
    [userData.year]
  );
  const skills = useMemo(() => userData.skills || [], [userData.skills]);

  return (
    <div className="relative bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
      <CornerBrackets />

      <div className="p-5 sm:p-7">
        {/* Top row: label + avatar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
              {role}
            </span>
            <span className="w-6 h-px bg-[#262626]" />
            <span className="text-[9px] text-[#A3A3A3] font-medium">{location}</span>
          </div>

          <ProfileAvatar
            image={userData.profile_image}
            name={userData.name}
            isOwnProfile={isOwnProfile}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-[#F5F5F5] m-0">
            {nameParts.firstName}
            <br />
            {nameParts.lastName}
          </h1>
        </div>

        {/* Bio */}
        {userData.bio && (
          <p className="text-[13px] sm:text-[14px] text-[#A3A3A3] leading-relaxed max-w-[500px] m-0 mb-4">
            {userData.bio}
          </p>
        )}

        {/* Skills */}
        <ProfileSkills skills={skills} />

        {/* Stats */}
        <ProfileStats stats={stats} />

        {/* Social Links */}
        <ProfileSocialLinks links={socialLinks} />

        {/* Actions */}
        <ProfileActions
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          isLoading={isFollowLoading}
          onFollow={onFollow}
          onMessage={onMessage}
          onEditClick={onEditClick}
          onShareClick={onShareClick}
        />
      </div>
    </div>
  );
}