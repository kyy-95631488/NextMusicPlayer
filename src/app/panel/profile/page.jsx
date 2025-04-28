"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/footer/Footer";
import ParticlesComponent from "../../components/particles/particlesreact";
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        toast.error("Failed to fetch user data");
      } else {
        const meta = userData.user.user_metadata || {};
        setUser(userData.user);
        setFullName(meta.full_name || "");
        setUsername(meta.username || "");
        setEmail(userData.user.email || "");
        if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
      }
    };

    fetchUser();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    setUploading(true);

    try {
      const updates = {};
      if (fullName !== user.user_metadata?.full_name) updates.full_name = fullName;
      if (username !== user.user_metadata?.username) updates.username = username;

      if (image) {
        const timestamp = Date.now();
        const filePath = `public/${user.id}_${timestamp}.png`;
        const { data, error } = await supabase.storage.from("avatars").upload(filePath, image);

        if (error) {
          toast.error(`Failed to upload image: ${error.message}`);
          return;
        }
        updates.avatar_url = data?.path;
        setAvatarUrl(data?.path);
        setImage(null);
        setFileName("");
        document.getElementById("file-upload").value = "";
      }

      const { error } = await supabase.auth.updateUser({ data: updates });
      if (error) toast.error("Failed to update profile");
      else toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const updateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) toast.error("Failed to update email");
    else toast.success("Email update request sent. Please verify.");
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("Failed to update password");
    else toast.success("Password updated successfully");
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] overflow-x-hidden relative">
      <ToastContainer />

      {/* Profile Content */}
      <div className="flex justify-center items-center flex-grow container mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 w-full md:w-10/12"
        >
          {/* Profile Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1.3 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
            className="flex flex-col bg-[#18191E] border-[#33353F] border-2 rounded-lg p-6 w-full sm:w-80"
          >
            <Link
              href="./dashboard"
              className="block text-center text-gray-400 hover:text-white text-sm mt-2 mb-4"
            >
              ← Back to Dashboard
            </Link>

            {/* Profile Image */}
            <div className="relative h-40 w-40 mx-auto mb-6 overflow-hidden rounded-full border-4 border-[#33353F]">
              {avatarUrl ? (
                <img
                  src={`https://cbpzbbjczpxfwmffalbf.supabase.co/storage/v1/object/public/avatars/${avatarUrl}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 text-black">
                  No Profile Picture
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center mb-4">
              <h6 className="text-white text-xl font-semibold">Profile</h6>
              {user ? (
                <p className="text-gray-300 mt-2">Welcome, {user.email}</p>
              ) : (
                <p className="text-red-500">Loading user data...</p>
              )}
            </div>

            {/* File Upload */}
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setFileName(e.target.files[0]?.name || "");
                }}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                {uploading ? (
                  <FaSpinner className="animate-spin inline-block mr-2" />
                ) : (
                  <FaCloudUploadAlt className="inline-block mr-2" />
                )}
                {uploading ? "Uploading..." : "Upload Image"}
              </label>
              {fileName && <p className="mt-2 text-sm text-gray-400">{fileName}</p>}
            </div>
          </motion.div>

          {/* Edit Profile Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1.3 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
            className="flex flex-col bg-[#18191E] border-[#33353F] border-2 rounded-lg p-6 w-full sm:w-96"
          >
            {user ? (
              <div>
                <label className="block text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-slate-700 text-white focus:outline-none"
                />

                <label className="block text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-slate-700 text-white focus:outline-none"
                />

                <label className="block text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-slate-700 text-white focus:outline-none"
                />

                <button
                  onClick={updateEmail}
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full mb-4 hover:bg-blue-600"
                >
                  Update Email
                </button>

                <label className="block text-gray-500 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-slate-700 text-white focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 mb-2 rounded-md bg-slate-700 text-white focus:outline-none"
                />

                <button
                  onClick={updatePassword}
                  className="bg-green-500 text-white py-2 px-4 rounded w-full mb-4 hover:bg-green-600"
                >
                  Update Password
                </button>

                <button
                  onClick={updateProfile}
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block mr-2" />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            ) : (
              <p className="text-center text-red-500">Loading user data...</p>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Particles */}
      <div id="particles" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    </main>
  );
};

export default Profile;
