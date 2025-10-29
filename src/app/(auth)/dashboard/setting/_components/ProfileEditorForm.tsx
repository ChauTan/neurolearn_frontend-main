// src/app/(auth)/dashboard/setting/_components/ProfileEditorForm.tsx
'use client';

import React, { useEffect, useState } from 'react'; // Import useState
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import EditInformationForm from './EditInformationForm';
import ChangePasswordForm from './ChangePasswordForm';
import { Button } from '@/components/common/ui/Button2';

// --- Định nghĩa Schema Validation bằng Zod ---
// Yêu cầu mật khẩu mạnh: 8-64 ký tự, có chữ thường, chữ hoa, số, ký tự đặc biệt, không chứa khoảng trắng
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])\S{8,64}$/;

const profileFormSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    age: z
      .string()
      .refine(
        val => val === '' || (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120),
        {
          message: 'Please enter a valid age.',
        }
      )
      .optional(),

    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    retypePassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only apply password validation if newPassword, oldPassword, or retypePassword fields are NOT empty
    // This implies the user is attempting to change password.
    const isPasswordChangeAttempt =
      (data.newPassword && data.newPassword.length > 0) ||
      (data.retypePassword && data.retypePassword.length > 0);

    if (isPasswordChangeAttempt) {
      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'New password is required.',
          path: ['newPassword'],
        });
      } else if (!strongPasswordRegex.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Password must be 8-64 chars, include uppercase, lowercase, number, special character, and no spaces.',
          path: ['newPassword'],
        });
      }
      if (data.newPassword && data.newPassword !== data.retypePassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match.',
          path: ['retypePassword'],
        });
      }
    }
    // If no password fields are filled, no password validation issues are added.
  });

// Export this type for use in other components
export type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileEditorFormProps {
  initialData: ProfileFormData; // Dữ liệu ban đầu có thể không đầy đủ
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const ProfileEditorForm: React.FC<ProfileEditorFormProps> = ({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }, // Added isDirty to check for changes
    reset,
    clearErrors, // Import clearErrors to clear errors
    setValue, // Import setValue to manually set field values
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
    mode: 'onChange', // Validate on change for better UX
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false); // New state for password section visibility

  // Reset form when initialData changes (e.g., when user data loads or is updated from parent)
  useEffect(() => {
    reset(initialData);
    // Optionally hide password section on initial load or successful save
    setShowPasswordChange(false);
  }, [initialData, reset]);

  const onSubmitHandler: SubmitHandler<ProfileFormData> = async data => {
    // Before saving, if password change section is NOT shown,
    // ensure password fields are empty so Zod doesn't validate them.
    // This is important if `isDirty` detects changes in password fields
    // even when they are hidden but might have residual values.
    if (!showPasswordChange) {
      data.oldPassword = '';
      data.newPassword = '';
      data.retypePassword = '';
      // Clear any password-related errors that might linger
      clearErrors(['oldPassword', 'newPassword', 'retypePassword']);
    }

    await onSave(data);
  };

  const handleCancelClick = () => {
    reset(initialData); // Reset form to initial data
    setShowPasswordChange(false); // Hide password section on cancel
    onCancel(); // Call parent's onCancel
  };

  const togglePasswordChange = () => {
    setShowPasswordChange(prev => !prev);
    // When hiding the password section, clear its values and errors
    if (showPasswordChange) {
      setValue('oldPassword', '');
      setValue('newPassword', '');
      setValue('retypePassword', '');
      clearErrors(['oldPassword', 'newPassword', 'retypePassword']);
    }
  };

  return (
    <div className="w-full lg:flex-1 bg-white p-6 sm:p-8 rounded-2xl ">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <fieldset disabled={isSaving} className="space-y-8">
          <EditInformationForm register={register} errors={errors} />

          <hr className="border-gray-200" />

          {/* Section to toggle password change form */}
          <section>
            <div className="mt-4">
              {!showPasswordChange ? (
                <Button
                  variant="outline" // Sử dụng variant "ghost" cho nền trong suốt và chữ màu
                  size="default"
                  onClick={togglePasswordChange}
                  disabled={isSaving}
                >
                  Change Password
                </Button>
              ) : (
                <>
                  <ChangePasswordForm register={register} errors={errors} />

                </>
              )}
            </div>
          </section>
        </fieldset>
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSaving}
            className="px-10 py-2.5 hover:cursor-pointer rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !isDirty} // Disable if saving or no changes
            className={
              'px-12 py-2.5 rounded-3xl hover:cursor-pointer text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            }
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditorForm;
