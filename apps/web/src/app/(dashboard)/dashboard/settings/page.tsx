"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Lock,
  Bell,
  Shield,
  Smartphone,
  Globe,
  Trash2,
  AlertTriangle,
  Camera,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { get, patch, post, del } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import { profileSchema, passwordChangeSchema, type ProfileInput, type PasswordChangeInput } from "@/lib/validators";
import type { ApiResponse, User } from "@/types";

const settingsTabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "privacy", label: "Privacy", icon: Shield },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      preferredLanguage: user?.customerProfile?.preferredLanguage as "en" | "si" | "ta" | undefined,
      currency: user?.customerProfile?.currency || "LKR",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileInput) => patch("/users/profile", data),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordChangeInput) =>
      patch("/users/change-password", data),
    onSuccess: () => {
      resetPassword();
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => del("/users/account", { password }),
    onSuccess: () => {
      // Redirect handled by auth store
    },
  });

  const onProfileSubmit = (data: ProfileInput) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordChangeInput) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-charcoal-900">Account Settings</h1>

      <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
        <div className="flex border-b border-cream-200 overflow-x-auto">
          {settingsTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-terracotta-600 text-terracotta-600"
                  : "border-transparent text-warm-gray-600 hover:text-charcoal-700",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-6 max-w-lg"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-warm-gray-200 flex items-center justify-center text-2xl text-warm-gray-500">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-terracotta-600 text-white rounded-full flex items-center justify-center hover:bg-terracotta-700 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-charcoal-900">{user?.fullName}</p>
                  <p className="text-sm text-warm-gray-500">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Full Name *
                </label>
                <input
                  {...registerProfile("fullName")}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                />
                {profileErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Email
                </label>
                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm bg-cream-50 text-warm-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">
                  Phone
                </label>
                <input
                  {...registerProfile("phone")}
                  placeholder="+94XXXXXXXXX"
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                />
                {profileErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Language
                  </label>
                  <select
                    {...registerProfile("preferredLanguage")}
                    className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                  >
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Currency
                  </label>
                  <select
                    {...registerProfile("currency")}
                    className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProfileSubmitting}
                className="px-6 py-2.5 bg-terracotta-600 text-white rounded-lg text-sm font-medium hover:bg-terracotta-700 transition-colors disabled:opacity-50"
              >
                {isProfileSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 max-w-lg">
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <h3 className="font-semibold text-charcoal-900">
                  Change Password
                </h3>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword("currentPassword")}
                    className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword("newPassword")}
                    className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    {...registerPassword("confirmNewPassword")}
                    className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-terracotta-500"
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="px-6 py-2.5 bg-terracotta-600 text-white rounded-lg text-sm font-medium hover:bg-terracotta-700 disabled:opacity-50"
                >
                  {isPasswordSubmitting
                    ? "Changing..."
                    : "Change Password"}
                </button>
              </form>

              <div className="border-t border-cream-200 pt-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-warm-gray-600 mb-3">
                  Add an extra layer of security to your account.
                </p>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-cream-300 rounded-full peer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                  <span className="text-sm text-charcoal-700">
                    {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    "Order updates",
                    "Shipping updates",
                    "Promotions & offers",
                    "Newsletter",
                    "Craft competitions",
                    "Vendor messages",
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-charcoal-700">{label}</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-cream-200 pt-6">
                <h3 className="font-semibold text-charcoal-900 mb-4">
                  Push Notifications
                </h3>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">
                    Push notifications
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6 max-w-lg">
              <label className="flex items-center justify-between">
                <span className="text-sm text-charcoal-700">
                  Marketing communications
                </span>
                <input
                  type="checkbox"
                  defaultChecked={
                    user?.customerProfile?.marketingOptIn ?? true
                  }
                  className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500"
                />
              </label>

              <div className="border-t border-cream-200 pt-6 space-y-3">
                <button
                  type="button"
                  className="w-full px-5 py-3 bg-white border border-cream-200 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Download My Data
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-5 py-3 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
              Delete Account?
            </h3>
            <p className="text-sm text-warm-gray-600 mb-4">
              This will permanently delete your account and all data. Enter your
              password to confirm.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-cream-200 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-cream-200 rounded-lg text-sm font-medium text-charcoal-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteAccountMutation.mutate(deletePassword)}
                disabled={!deletePassword || deleteAccountMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteAccountMutation.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
