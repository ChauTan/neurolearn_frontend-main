'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import login_background from '@/public/assets/home/login-bg.png';
import { useToast } from '@/hooks/use-toast';
import { useResetPasswordMutation } from '@/lib/redux/features/auth/authApi';
import { useModal } from '@/context/ModalContext';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import { X } from 'lucide-react';
import PasswordField from './PasswordField';
// Removed unused imports:
// import Button from '@/components/common/ui/Button';
// import { Input } from './InputField';

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(20, { message: 'Password must be at most 20 characters long.' })
      .refine(val => /[A-Z]/.test(val), { message: 'Must contain an uppercase letter.' })
      .refine(val => /[a-z]/.test(val), { message: 'Must contain a lowercase letter.' })
      .refine(val => /[0-9]/.test(val), { message: 'Must contain a number.' })
      .refine(val => /[!@#$%^&*]/.test(val), { message: 'Must contain a special character.' }),
    confirmPassword: z.string().min(1, { message: 'This field has to be filled.' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Define a type for the auth state slice
interface AuthState {
  token: string | null;
  // Add other properties of your auth state if needed
}

// Define a type for the overall Redux state
interface RootState {
  auth: AuthState;
  // Add other state slices if needed
}

// Define a type for API errors (similar to ForgotPasswordForm)
interface ApiError {
  data?: {
    message?: string;
    // other error data fields
  };
  status?: number;
  // other error fields
}

// Define a type for the success data from useResetPasswordMutation
interface ResetPasswordSuccessData {
  message?: string;
  // other success data fields
}

const NewPasswordForm = ({ onClose }: { onClose: () => void }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { data, error, isSuccess, isLoading }] = useResetPasswordMutation();

  // Use the defined RootState type for useSelector
  const { token } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const { showModal } = useModal();

  useEffect(() => {
    if (isSuccess) {
      // Explicitly type data if its structure is known
      const successData = data as ResetPasswordSuccessData | undefined;
      const message = successData?.message || 'Password has been updated';
      toast({
        variant: 'success',
        title: 'Reset Password Successfully',
        description: message,
      });
      showModal('login');
    }
    if (error && 'data' in error) {
      // Use the ApiError type for better type safety
      const errData = error as ApiError;
      const errorMessage = errData.data?.message || 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorMessage,
      });
    }
    // Add missing dependencies to the array
  }, [isSuccess, error, data, toast, showModal]);

  const handleSubmit = async () => {
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: result.error.issues[0].message,
      });
      return;
    }

    await resetPassword({
      newPassword: password,
      reset_token: token, // Ensure token is not null here or handle appropriately
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-inter">
      <div className="relative w-full max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={login_background}
          alt="Reset password background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />

        <div className="relative z-10 flex flex-col md:flex-row w-full h-full rounded-3xl">
          <div className="w-full md:w-1/2 p-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#ededed] hover:text-black text-xl hover:cursor-pointer transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-gray-900 text-left">Reset Password</h2>
            <p className="text-sm text-gray-600 mb-6">Set your new password</p>

            <div className="space-y-4">
              <PasswordField
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New Password"
              />
              <PasswordField
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full items-center rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50"
              >
                {isLoading ? <SpinnerMini /> : 'Reset'}
              </button>

              <p className="text-sm mt-6 text-center text-gray-700">
                Go back to{' '}
                <button
                  type="button"
                  onClick={() => showModal('login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default NewPasswordForm;
