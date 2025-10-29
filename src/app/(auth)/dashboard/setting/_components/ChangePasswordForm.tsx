// src/app/(auth)/dashboard/setting/_components/ChangePasswordForm.tsx
import React from 'react';
import FormField from './FormField';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileFormData } from './ProfileEditorForm'; // Import type from parent file

interface ChangePasswordFormProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ register, errors }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {/* Field for New Password */}
        <FormField
          label="New Password"
          id="newPassword"
          type="password"
          placeholder="new password"
          autoComplete="new-password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        {/* Field for Re-Type New Password */}
        <FormField
          label="Re-Type New password"
          id="retypePassword"
          type="password"
          placeholder="retype new password"
          autoComplete="new-password"
          {...register('retypePassword')}
          error={errors.retypePassword?.message}
        />
      </div>
    </section>
  );
};

export default ChangePasswordForm;
