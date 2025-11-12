"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Sun, Moon, Bell, Shield, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUser, updateUser } from "@/lib/actions";

const SettingForm = ({
  userId,
  userProfile,
}: {
  userId: string;
  userProfile?: any;
}) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    notifications: userProfile?.notifications ?? true,
    isPublic: userProfile?.isPublic ?? false,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) {
      setSettings((prev) => ({
        ...prev,
        notifications: savedNotifications === "true",
      }));
    }
  }, []);

  useEffect(() => {
    if (userProfile?.isDarkMode !== undefined) {
      const userTheme = userProfile.isDarkMode ? "dark" : "light";
      if (theme !== userTheme) {
        setTheme(userTheme);
      }
    }
  }, [userProfile?.isDarkMode, theme, setTheme]);

  const handleToggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    if (key === "notifications") {
      localStorage.setItem("notifications", String(updated[key]));
    }

    console.log("Next Features");
  };

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (!userId) return;
    const formData = new FormData();
    formData.append("isDarkMode", String(newTheme === "dark"));

    startTransition(async () => {
      const res = await updateUser(userId, formData);
      if (res.success) toast.success("Theme updated!");
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteUser(userId);
      toast.success("Your account has been deleted!");
      router.push("/");
    });
    setShowConfirm(false);
    toast.success("Your account has been deleted!");
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Settings
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>
          Manage your account preferences and settings
        </p>
      </div>

      <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
              Appearance
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Choose your preferred theme
            </p>
          </div>
          <button
            onClick={handleThemeChange}
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium'>
            {theme === "dark" ? (
              <>
                <Sun className='h-4 w-4 text-yellow-500' /> Switch to Light
              </>
            ) : (
              <>
                <Moon className='h-4 w-4 text-blue-600' /> Switch to Dark
              </>
            )}
          </button>
        </div>
      </div>

      <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Bell className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            <div>
              <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
                Notifications
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Enable or disable email updates
              </p>
            </div>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>

      <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Shield className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            <div>
              <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
                Profile Visibility
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Make your profile visible to others
              </p>
            </div>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={settings.isPublic}
              onChange={() => handleToggle("isPublic")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>

      <div className='p-6 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20'>
        <h2 className='font-semibold text-red-600 dark:text-red-400 mb-2'>
          Danger Zone
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
          Delete your account permanently. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'>
          <Trash2 className='h-4 w-4' /> Delete Account
        </button>

        {showConfirm && (
          <div className='mt-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-md'>
            <p className='text-sm text-gray-700 dark:text-gray-300 mb-4'>
              Are you sure you want to delete your account? This cannot be
              undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={handleDelete}
                className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md'>
                {isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <>
                    <Trash2 className='h-4 w-4' /> Confirm Delete
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingForm;
