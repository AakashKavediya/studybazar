// app/profile/components/ProfileHero.jsx
"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaUserPlus, 
  FaUserCheck, 
  FaComment, 
  FaCamera, 
  FaEdit, 
  FaShareAlt,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaSpinner,
  FaTimes,
  FaUpload
} from "react-icons/fa";
import { setUser } from "@/features/auth/authSlice";

// Default avatar as inline SVG (no external file needed)
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23161616'/%3E%3Ccircle cx='50' cy='40' r='25' fill='%23333333'/%3E%3Ccircle cx='50' cy='85' r='30' fill='%23333333'/%3E%3C/svg%3E";

// Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, WEBP, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  const handleClose = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    onClose();
  }, [previewUrl, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-[#161616] rounded-3xl max-w-[420px] w-full p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-bold text-[#F5F5F5]">Change Profile Picture</h3>
          <button 
            className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors p-1 rounded-lg hover:bg-[#111111]"
            onClick={handleClose}
            disabled={isLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Preview */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#262626] relative bg-[#111111]">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaCamera size={32} className="text-[#333333]" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          
          <button
            className="w-full p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <FaUpload className="inline mr-2" size={14} />
            Choose Image
          </button>

          {selectedFile && (
            <p className="text-[12px] text-[#A3A3A3]">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {uploadError && (
            <p className="text-[12px] text-red-500 text-center">
              {uploadError}
            </p>
          )}

          <div className="flex gap-3 w-full">
            <button
              className="flex-1 p-3 rounded-xl border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`flex-1 p-3 rounded-xl border-none font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedFile && !isLoading
                  ? "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 cursor-pointer"
                  : "bg-[#333333] text-[#666666] cursor-not-allowed opacity-50"
              }`}
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
          .animate-spin {
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

function ProfileHero({
  userData,
  isOwnProfile,
  isFollowing,
  setIsFollowing,
  onEditClick,
  onShareClick,
}) {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Memoize social links - filter out invalid URLs
  const socialLinks = useMemo(() => {
    const links = [
      { icon: FaGlobe, label: "Website", url: userData.social_links?.website },
      { icon: FaTwitter, label: "Twitter", url: userData.social_links?.twitter },
      { icon: FaLinkedin, label: "LinkedIn", url: userData.social_links?.linkedin },
      { icon: FaGithub, label: "GitHub", url: userData.social_links?.github },
    ];
    return links.filter(link => link.url && link.url !== "#" && link.url.trim() !== "");
  }, [userData.social_links]);

  // Memoize stats
  const stats = useMemo(() => [
    { label: "Products", value: userData.products_sold_count || 0 },
    { label: "Sold", value: userData.active_listings_count || 0 },
    { label: "Followers", value: userData.followers_count || 0 },
  ], [userData]);

  // Memoize name parts
  const nameParts = useMemo(() => {
    const fullName = userData.name || "";
    const parts = fullName.split(" ");
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  }, [userData.name]);

  // Memoize profile image with fallback
  const profileImage = useMemo(() => {
    if (userData.profile_image && userData.profile_image.startsWith('http')) {
      return userData.profile_image;
    }
    return DEFAULT_AVATAR;
  }, [userData.profile_image]);

  // Memoize location
  const location = useMemo(() => 
    userData.campus || "Student",
    [userData.campus]
  );

  // Memoize role
  const role = useMemo(() => 
    userData.year ? `${userData.year} Year Student` : "Student",
    [userData.year]
  );

  // Memoize skills
  const skills = useMemo(() => 
    userData.skills || [],
    [userData.skills]
  );

  // ✅ UPDATED: Handle image upload using dedicated POST /users/profile_image endpoint
  const handleImageUpload = useCallback(async (file) => {
    setIsUploading(true);
    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'study-mart');

      console.log('📤 Uploading to Cloudinary...');
      
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtdivzyct'}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      const imageUrl = cloudinaryResponse.data.secure_url;
      console.log('✅ Uploaded to Cloudinary:', imageUrl);

      // Step 2: Update profile using the dedicated POST /users/profile_image endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://diplomatic-mindfulness-production-621b.up.railway.app';
      
      const updateResponse = await axios.post(
        `${apiUrl}/users/profile_image`,  // ✅ NEW DEDICATED ENDPOINT
        { profile_image: imageUrl },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 30000,
        }
      );

      console.log('✅ Profile image updated:', updateResponse.data);
      
      // Update Redux store with the updated user data
      if (updateResponse.data && updateResponse.data.user) {
        dispatch(setUser(updateResponse.data.user));
      }
      
      // Close modal
      setShowUploadModal(false);
      alert('✅ Profile picture updated successfully!');
      
    } catch (error) {
      console.error('❌ Image upload error:', error);
      
      // Check for specific error types
      let errorMessage = 'Failed to upload image. ';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server error response:', error.response.data);
        if (error.response.status === 401) {
          errorMessage += 'Session expired. Please login again.';
        } else if (error.response.status === 404) {
          errorMessage += 'API endpoint not found. Please check the URL.';
        } else {
          errorMessage += error.response.data?.detail || 
                        error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage += 'Server not reachable. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please try again.';
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [accessToken, dispatch]);

  return (
    <>
      <div className="relative bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
        {/* Corner brackets */}
        <span className="hidden sm:block absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#F5A623]/40 rounded-tl-sm" />
        <span className="hidden sm:block absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#F5A623]/40 rounded-tr-sm" />
        <span className="hidden sm:block absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#F5A623]/40 rounded-bl-sm" />
        <span className="hidden sm:block absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#F5A623]/40 rounded-br-sm" />

        <div className="p-5 sm:p-7">
          {/* Top row: label + avatar */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
                {role}
              </span>
              <span className="w-6 h-px bg-[#262626]" />
              <span className="text-[9px] text-[#A3A3A3] font-medium">
                {location}
              </span>
            </div>

            <div className="relative shrink-0">
              <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-xl overflow-hidden border border-[#262626] relative bg-[#111111]">
                <img
                  src={profileImage}
                  alt={userData.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              {isOwnProfile && (
                <button 
                  className="absolute -bottom-1 -right-1 bg-[#F5A623] border-2 border-[#161616] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-[#0A0A0A] transition-transform hover:scale-110"
                  onClick={() => setShowUploadModal(true)}
                  aria-label="Change profile picture"
                >
                  <FaCamera size={11} />
                </button>
              )}
            </div>
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
          {skills.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
                  Skills
                </span>
                <span className="w-6 h-px bg-[#262626]" />
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-[10px] font-medium text-[#A3A3A3] border border-[#262626] rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 sm:gap-8 mb-4 flex-wrap">
            {stats.map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-6 sm:gap-8">
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-semibold text-[#F5F5F5]">{s.value}</span>
                  <span className="text-[9px] text-[#A3A3A3] font-medium uppercase tracking-[0.3px]">
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-6 bg-[#262626]" />}
              </div>
            ))}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mb-4 pt-3 border-t border-[#262626]">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
                  Connect
                </span>
                <span className="w-6 h-px bg-[#262626]" />
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#A3A3A3] hover:text-[#F5F5F5] transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon size={14} className="group-hover:text-[#F5A623] transition-colors" />
                      <span className="text-[11px] font-medium hidden sm:inline">
                        {social.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          {isOwnProfile ? (
            <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 active:scale-95"
                onClick={onEditClick}
                aria-label="Edit profile"
              >
                <FaEdit size={14} />
                Edit Profile
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#262626] bg-[#111111] text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#262626] hover:text-[#F5F5F5]"
                onClick={onShareClick}
                aria-label="Share profile"
              >
                <FaShareAlt size={14} />
                Share
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
              <button
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all ${
                  isFollowing
                    ? "bg-[#111111] text-[#A3A3A3] border border-[#262626]"
                    : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
                aria-label={isFollowing ? "Unfollow" : "Follow"}
              >
                {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button 
                className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#111111] hover:text-[#F5F5F5]"
                aria-label="Send message"
              >
                <FaComment size={14} />
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleImageUpload}
        isLoading={isUploading}
      />
    </>
  );
}

export default ProfileHero;