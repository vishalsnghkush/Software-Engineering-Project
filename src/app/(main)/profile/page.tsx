"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Camera, User, EnvelopeSimple, Phone, Building, IdentificationCard, ShieldCheck, Spinner } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: sessionData, isPending } = authClient.useSession();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Initialize form when session loads
  useEffect(() => {
    if (sessionData?.user) {
      setName(sessionData.user.name || "");
      setImage(sessionData.user.image || "");
      
      // Load mockup local data for extra fields if exist
      const localProfile = localStorage.getItem(`profile_extras_${sessionData.user.id}`);
      if (localProfile) {
        const p = JSON.parse(localProfile);
        setPhone(p.phone || "");
        setInstitution(p.institution || "");
        setBio(p.bio || "");
      }
    }
  }, [sessionData]);

  if (isPending) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size={32} className="animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!sessionData?.user) {
    return null;
  }

  const user = sessionData.user;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // 1. Update Core Auth Data (saved to DB automatically by better-auth)
      const { data, error } = await authClient.updateUser({
        name: name,
        image: image || undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to update core profile");
      }

      // 2. Save mock extra fields locally
      localStorage.setItem(`profile_extras_${user.id}`, JSON.stringify({
        phone,
        institution,
        bio
      }));

      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#0b1120] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm">Manage your personal information, profile picture, and application preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Messages */}
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {message.type === 'success' ? <ShieldCheck size={20} /> : null}
              {message.text}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-start md:items-center gap-6 flex-col md:flex-row shadow-lg">
            <div className="relative group shrink-0 w-24 h-24 cursor-pointer" onClick={() => document.getElementById('profile-upload')?.click()}>
              {image ? (
                <img src={image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-[#0b1120] shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-[#0b1120] shadow-xl">
                  <User size={40} className="text-slate-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              <div>
                <h3 className="text-base font-semibold text-slate-200">Profile Picture</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the avatar or the button below to upload a new profile picture. Supported formats: JPG, PNG, WebP. It will be automatically resized.
                </p>
              </div>
              <input 
                type="file" 
                id="profile-upload"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // Compress and resize image using canvas
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const MAX_SIZE = 256;
                      let width = img.width;
                      let height = img.height;

                      if (width > height) {
                        if (width > MAX_SIZE) {
                          height *= MAX_SIZE / width;
                          width = MAX_SIZE;
                        }
                      } else {
                        if (height > MAX_SIZE) {
                          width *= MAX_SIZE / height;
                          height = MAX_SIZE;
                        }
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx?.drawImage(img, 0, 0, width, height);
                      // Convert to base64 jpeg
                      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                      setImage(dataUrl);
                    };
                    img.src = event.target?.result as string;
                  };
                  reader.readAsDataURL(file);
                  // Reset input
                  e.target.value = '';
                }}
              />
              <button 
                type="button" 
                onClick={() => document.getElementById('profile-upload')?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-white min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
              >
                Upload New Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar Info */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm border-b border-slate-800 pb-3 mb-4 font-bold text-slate-400 uppercase tracking-wider">Account Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <IdentificationCard size={20} className="text-slate-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">User ID</p>
                      <p className="text-xs text-slate-300 font-mono truncate max-w-[150px]">{user.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeSimple size={20} className="text-slate-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Email Address</p>
                      <p className="text-sm text-slate-300 truncate max-w-[170px]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Account Status</p>
                      <p className="text-xs text-emerald-400 font-semibold">{user.emailVerified ? "Verified User" : "Active"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg space-y-6">
                
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-6">
                  <User size={20} className="text-blue-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#0b1120] border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex justify-between">
                      Phone Number <span className="text-[10px] text-slate-500 font-normal uppercase">Optional</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#0b1120] border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex justify-between">
                    Institution / School <span className="text-[10px] text-slate-500 font-normal uppercase">Optional</span>
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Delhi Public School"
                      className="w-full bg-[#0b1120] border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex justify-between">
                    Bio / Objectives <span className="text-[10px] text-slate-500 font-normal uppercase">Optional</span>
                  </label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Aiming for IIT JEE..."
                    rows={4}
                    className="w-full bg-[#0b1120] border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                  <p className="text-[10px] text-slate-500 text-right mt-1">Briefly describe your academic goals.</p>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => router.back()}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    {isSaving && <Spinner size={16} className="animate-spin" />}
                    {isSaving ? "Saving details..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
