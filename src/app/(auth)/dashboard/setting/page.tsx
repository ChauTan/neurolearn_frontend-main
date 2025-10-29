// src/app/(auth)/dashboard/setting/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import ProfileSidebar from './_components/ProfileSidebar';
import ProfileEditorForm from './_components/ProfileEditorForm';
import { User } from '@/types/user'; // Ensure this path is correct
import { useToast } from '@/hooks/use-toast'; // Ensure this path is correct
import { useAppDispatch } from '@/lib/redux/hooks'; // Ensure this path is correct
import { setUserInfo, userLoggerOut } from '@/lib/redux/features/auth/authSlice'; // Ensure this path is correct, and userLoggerOut is imported
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

import {
  useLoadUserQuery,
  useUpdateCurrentUserInfoMutation,
  useUpdateUserAvatarMutation,
  useUpdatePasswordMutation,
} from '@/lib/redux/features/api/apiSlice'; // Ensure this path is correct
import { ProfileFormData } from './_components/ProfileEditorForm'; // Import ProfileFormData type
import Loading from '@/components/common/Loading';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const SettingPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  // Use useLoadUserQuery to fetch initial user data
  const { data: userData, isLoading, isError, error } = useLoadUserQuery(undefined);
  const user = userData?.user || null;

  // Initialize RTK Query Mutations
  const [updateCurrentUserInfo, { isLoading: isUpdatingInfo }] = useUpdateCurrentUserInfoMutation();
  const [updateUserAvatar, { isLoading: isUpdatingAvatar }] = useUpdateUserAvatarMutation();
  const [updatePassword, { isLoading: isUpdatingPassword, isSuccess: isPasswordUpdateSuccess }] =
    useUpdatePasswordMutation();

  // Combine loading states for the Save button
  const isSaving = isUpdatingInfo || isUpdatingAvatar || isUpdatingPassword;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Limit to 2MB
        toast({
          title: 'Error',
          description: 'Image file is too large. Maximum 2MB.',
          variant: 'destructive',
        });
        return;
      }
      setNewAvatarFile(file);
      setNewAvatarPreview(URL.createObjectURL(file)); // Create URL for preview
    }
  };

  // Effect to update form data and Redux store when user data from RTK Query changes
  useEffect(() => {
    if (user) {
      dispatch(setUserInfo(user)); // Update Redux store with latest user data
    }
    // Handle error from useLoadUserQuery
    if (isError) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: (error as any)?.data?.message || 'Failed to load user profile.',
        variant: 'destructive',
      });
    }
  }, [user, dispatch, isError, error, toast]);

  // Effect to handle successful password update (logout and redirect)
  useEffect(() => {
    if (isPasswordUpdateSuccess) {
      toast({
        title: 'Password Updated!',
        description:
          'Your password has been changed successfully. Please re-login with new password.',
        variant: 'success',
      });
      // Dispatch logout action to clear user data from Redux and localStorage
      dispatch(userLoggerOut());
      // Redirect to login page
      router.push('/');
    }
  }, [isPasswordUpdateSuccess, dispatch, router, toast]); // Add toast to dependency array

  // Handle form submission
  const handleSaveChanges = async (formData: ProfileFormData) => {
    if (!user) return; // Ensure user data is available

    try {
      let hasChanges = false;
      let passwordAttemptedChange = false;

      // 1. Handle avatar upload and update if a new file is selected
      if (newAvatarFile) {
        hasChanges = true;
        const avatarBase64 = await fileToBase64(newAvatarFile);
        await updateUserAvatar(avatarBase64).unwrap(); // Call RTK Query mutation
        console.log('Avatar updated successfully.');
      }

      // 2. Handle text information update if changes are detected
      const ageAsNumber = formData.age ? parseInt(formData.age, 10) : undefined;
      const currentAge = user.age === null || user.age === undefined ? '' : user.age.toString();
      const currentName = user.name || '';

      if (
        formData.name.trim() !== currentName ||
        (formData.age !== currentAge && ageAsNumber !== undefined) // Compare actual values
      ) {
        hasChanges = true;
        const infoToUpdate: Partial<User> = {
          name: formData.name.trim(),
          age: ageAsNumber,
        };
        await updateCurrentUserInfo(infoToUpdate).unwrap(); // Call RTK Query mutation
        console.log('User info updated successfully.');
      }

      // 3. Handle password update if new password fields are filled
      // The Zod schema in ProfileEditorForm should handle basic password validation (empty, length, match)
      // Here, we only call the API if newPassword is provided.
      if (formData.newPassword) {
        // Check length after Zod validation to be safe
        passwordAttemptedChange = true;
        // The Zod validation should already ensure oldPassword, newPassword, retypePassword conditions
        // are met if a password change is attempted. If not, the form wouldn't submit.

        await updatePassword({
          newPassword: formData.newPassword,
        }).unwrap();
        // Success toast and logout/redirect handled by the isPasswordUpdateSuccess useEffect
      }

      // Show general success/no changes toast if no password change was attempted or successful
      if (hasChanges && !passwordAttemptedChange) {
        toast({
          title: 'Success!',
          description: 'Your profile has been updated.',
          variant: 'success',
        });
      } else if (!hasChanges && !passwordAttemptedChange) {
        toast({
          title: 'No Changes',
          description: "You haven't made any changes.",
          variant: 'default',
        });
      }

      // Reset temporary states for avatar preview
      if (newAvatarPreview) URL.revokeObjectURL(newAvatarPreview);
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
      // The ProfileEditorForm will be reset when `user` changes or when the form is submitted
      // and `initialData` is re-evaluated based on the updated user data.
    } catch (err) {
      console.error('Error saving profile:', err);
      const errorMessage =
        (err as any)?.data?.message || 'Failed to update profile. Please try again.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      // isSaving state is managed by RTK Query hooks, no manual setIsSaving needed here
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        <ProfileSidebar
          user={user}
          onFileChange={handleFileChange}
          newAvatarPreview={newAvatarPreview}
        />

        {isLoading || !user ? (
          <Loading message="Loading profile..." size="lg" className="w-full lg:flex-1" />
        ) : (
          <ProfileEditorForm
            initialData={{
              name: user.name,
              age: user.age?.toString() || '',
              oldPassword: '', // Ensure these are explicitly empty strings
              newPassword: '',
              retypePassword: '',
            }}
            onSave={handleSaveChanges}
            onCancel={() => {
              console.log('Cancel clicked, form was reset.');
            }}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default SettingPage;
