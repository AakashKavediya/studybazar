// app/profile/components/EditModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditModal({ 
    isOpen, 
    onClose, 
    userData, 
    onSave,
    isLoading = false 
}) {
    // Initialize form state with user data
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle social link changes
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [name]: value,
            },
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
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
                ? formData.skills.split(",").map(s => s.trim()).filter(s => s)
                : [],
            social_links: formData.social_links,
        };

        // Remove empty/null fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === "" || updateData[key] === null || updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        onSave(updateData);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn" 
            onClick={onClose}
        >
            <div 
                className="bg-[#161616] rounded-3xl max-w-[480px] w-full p-6 animate-scaleIn max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5 sticky top-0 bg-[#161616] z-10 pb-2">
                    <h3 className="text-[20px] font-bold m-0 text-[#F5F5F5]">Edit Profile</h3>
                    <button 
                        className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5] disabled:opacity-50"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-3 mb-5">
                        {/* Basic Info */}
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Full Name" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                        
                        {/* Read-only Email */}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#1A1A1A] text-[#666666] text-[14px] outline-none cursor-not-allowed"
                            value={userData?.email || ""}
                            disabled
                        />
                        
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        
                        <input 
                            type="text" 
                            name="campus"
                            placeholder="College/University" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.campus}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        
                        <input 
                            type="text" 
                            name="branch"
                            placeholder="Branch/Department" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.branch}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        
                        <input 
                            type="number" 
                            name="year"
                            placeholder="Year (1-5)" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={isLoading}
                            min="1"
                            max="5"
                        />
                        
                        <textarea 
                            name="bio"
                            placeholder="Bio" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] resize-y font-inherit disabled:opacity-50" 
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            disabled={isLoading}
                        />

                        <input 
                            type="text" 
                            name="skills"
                            placeholder="Skills (comma separated: React, Python, ML)" 
                            className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                            value={formData.skills}
                            onChange={handleChange}
                            disabled={isLoading}
                        />

                        {/* Social Links Section */}
                        <div className="border-t border-[#262626] pt-3 mt-2">
                            <p className="text-[12px] text-[#A3A3A3] font-medium mb-2">Social Links</p>
                            
                            <input 
                                type="url" 
                                name="website"
                                placeholder="Website URL" 
                                className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50 mb-2"
                                value={formData.social_links.website}
                                onChange={handleSocialChange}
                                disabled={isLoading}
                            />
                            
                            <input 
                                type="url" 
                                name="github"
                                placeholder="GitHub URL" 
                                className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50 mb-2"
                                value={formData.social_links.github}
                                onChange={handleSocialChange}
                                disabled={isLoading}
                            />
                            
                            <input 
                                type="url" 
                                name="twitter"
                                placeholder="Twitter URL" 
                                className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50 mb-2"
                                value={formData.social_links.twitter}
                                onChange={handleSocialChange}
                                disabled={isLoading}
                            />
                            
                            <input 
                                type="url" 
                                name="linkedin"
                                placeholder="LinkedIn URL" 
                                className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50"
                                value={formData.social_links.linkedin}
                                onChange={handleSocialChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>

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
}