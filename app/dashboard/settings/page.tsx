"use client";

import React, { useEffect, useState } from "react";
import { SettingsService } from "@/services/setings.service";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  // User info
  const [user, setUser] = useState<any>(null);

  // Notification preferences (locally stored for now)
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Security modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Password fields
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  // 2FA fields
  const [otp, setOtp] = useState("");
  const [qrCode, setQrCode] = useState("");

  // ----------------------------
  // Load user profile
  // ----------------------------
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const profile = await SettingsService.getProfile();
      setUser(profile);

      // Load stored notifications (no backend endpoint exists for this)
      setEmailNotif(localStorage.getItem("emailNotif") === "true");
      setSmsNotif(localStorage.getItem("smsNotif") === "true");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------
  // Update notification toggles
  // ----------------------------
  function toggleEmailNotif() {
    const value = !emailNotif;
    setEmailNotif(value);
    localStorage.setItem("emailNotif", String(value));
  }

  function toggleSmsNotif() {
    const value = !smsNotif;
    setSmsNotif(value);
    localStorage.setItem("smsNotif", String(value));
  }

  // ----------------------------
  // Update Profile API
  // ----------------------------
  async function handleUpdateProfile() {
    if (!user) return toast.error("User not loaded");

    try {
      await SettingsService.updateProfile(user.id, {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      });
      toast.success("Profile updated");
    } catch (err: any) {
      console.error(err);
    }
  }

  // ----------------------------
  // Change Password
  // ----------------------------
  async function handlePasswordChange() {
    try {
      await SettingsService.changePassword({
        old_password: oldPass,
        new_password: newPass,
      });

      toast.success("Password updated");
      setShowPasswordModal(false);
      setOldPass("");
      setNewPass("");
    } catch (err) {
      console.error(err);
    }
  }

  // ----------------------------
  // Enable 2FA (Step 1: request QR)
  // ----------------------------
  async function request2FA() {
    try {
      const res = await SettingsService.requestQRCode();
      setQrCode(res.qr_image || "");
      toast.info("Scan the QR code with Google Authenticator");
    } catch (err) {
      console.error(err);
    }
  }

  // ----------------------------
  // Enable 2FA (Step 2: verify OTP)
  // ----------------------------
  async function confirm2FA() {
    try {
      await SettingsService.verify2FA({ otp });
      toast.success("Two-factor authentication enabled");
      setShow2FAModal(false);
      setOtp("");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading Settings...</div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full">
      <div className="bg-white border border-[#CCEAE9] rounded-2xl p-10 w-full max-w-6xl mx-auto mt-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ---------------------------- */}
          {/* Personal Information */}
          {/* ---------------------------- */}
          <div className="border-r border-[#CCEAE9] pr-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#001B2E]">
              Personal Information
            </h2>

            <div className="mb-4">
              <div className="text-gray-500 text-sm mb-1">Full Name</div>
              <div className="text-[#001B2E] font-medium">
                {user?.first_name} {user?.last_name}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-gray-500 text-sm mb-1">Email</div>
              <div className="text-[#001B2E]">{user?.email}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-500 text-sm mb-1">Phone Number</div>
              <div className="text-[#001B2E] font-medium">
                {user?.phone || "N/A"}
              </div>
            </div>

            <button
              onClick={handleUpdateProfile}
              className="bg-[#012638] text-white px-6 py-2 rounded font-semibold text-base"
            >
              Update Information
            </button>
          </div>

          {/* ---------------------------- */}
          {/* Notifications */}
          {/* ---------------------------- */}
          <div className="border-r border-[#CCEAE9] px-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#001B2E]">
              Notifications
            </h2>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={toggleEmailNotif}
                  className="form-checkbox w-5 h-5 text-[#019893] border-[#CCEAE9] rounded"
                />
                <span className="text-[#001B2E] text-base">
                  Receive email notifications
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={toggleSmsNotif}
                  className="form-checkbox w-5 h-5 text-[#019893] border-[#CCEAE9] rounded"
                />
                <span className="text-[#001B2E] text-base">
                  Receive SMS notifications
                </span>
              </label>
            </div>
          </div>

          {/* ---------------------------- */}
          {/* Security */}
          {/* ---------------------------- */}
          <div className="pl-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#001B2E]">
              Security
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-[#001B2E] text-base text-left hover:underline"
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  request2FA();
                  setShow2FAModal(true);
                }}
                className="text-[#001B2E] text-base text-left hover:underline"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------- */}
      {/* Footer */}
      {/* ---------------------------- */}
      <div className="w-full bg-[#F6F7FA] py-4 mt-8">
        <div className="text-center text-gray-400 text-base">
          © 2025 Fintech Dashboard
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* PASSWORD MODAL */}
      {/* ---------------------------------- */}
      {showPasswordModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/5 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-[#012638] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------- */}
      {/* 2FA MODAL */}
      {/* ---------------------------------- */}
      {show2FAModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/5 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Enable Two-Factor Authentication
            </h2>

            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto w-40 h-40 mb-4 border p-2 rounded-lg"
              />
            ) : (
              <p className="text-center mb-4 text-gray-600">Loading QR code…</p>
            )}

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter authentication code"
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirm2FA}
                className="px-4 py-2 bg-[#012638] text-white rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
