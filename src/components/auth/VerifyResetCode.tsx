'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import login_background from '@/public/assets/home/login-bg.png';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { useResetCodeMutation } from '@/lib/redux/features/auth/authApi'; // Corrected import
import { useModal } from '@/context/ModalContext';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import { X } from 'lucide-react';
// Removed: import Button from '@/components/common/ui/Button'; // Unused import

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

// --- START OF CHANGES ---
// Define a type for the auth state slice
interface AuthState {
  token: string | null; // Assuming token is a string or null
  // Add other properties of your auth state if needed
}

// Define a type for the overall Redux state
interface RootState {
  auth: AuthState;
  // Add other state slices if needed
}

// Define a type for API errors
interface ApiError {
  data?: {
    message?: string;
    // other error data fields
  };
  status?: number;
  // other error fields
}
// --- END OF CHANGES ---

export default function VerifyResetCode({ onClose }: { onClose: () => void }) {
  const { showModal } = useModal();
  const { toast } = useToast();
  // Use the defined RootState type for useSelector
  const { token } = useSelector((state: RootState) => state.auth);

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  const [invalidError, setInvalidError] = useState(false);
  const [resetCode, { isLoading, isSuccess, error }] = useResetCodeMutation();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Verification successful!',
      });
      showModal('newPassword');
    }

    if (error && 'data' in error) {
      // --- START OF CHANGES ---
      // Use the ApiError type for better type safety
      const apiError = error as ApiError;
      const errorMessage = apiError.data?.message || 'Invalid code';
      // --- END OF CHANGES ---
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: errorMessage,
      });
      setInvalidError(true);
    }
  }, [isSuccess, error, toast, showModal]); // Dependencies look correct

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    // Allow only numeric input for verification codes
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return; // Prevent pasting multiple digits

    const newVerifyNumber = { ...verifyNumber, [index]: numericValue };
    setVerifyNumber(newVerifyNumber);

    if (numericValue === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (numericValue.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const verify = async () => {
    const code = Object.values(verifyNumber).join('');
    if (code.length !== 4) {
      setInvalidError(true);
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'Reset code must be 4 digits.',
      });
      return;
    }

    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Reset token is missing. Please try again.',
      });
      return;
    }

    await resetCode({
      reset_token: token, // Ensure this matches the expected property name by useResetCodeMutation
      reset_code: code, // Ensure this matches the expected property name
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-inter">
      <div className="relative w-full max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        {/* Background */}
        <Image
          src={login_background}
          alt="Verification background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full rounded-3xl">
          {/* Left: Code Input */}
          <div className="w-full md:w-1/2 p-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-300 hover:text-gray-700 text-xl hover:cursor-pointer transition-colors duration-200" // Adjusted close button color
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-gray-900 text-left">Enter Reset Code</h2>
            <p className="text-sm text-gray-600 mb-6">Check your email for the 4-digit code</p>

            <div className="flex justify-center gap-3 sm:gap-4 mb-6">
              {Object.keys(verifyNumber).map((key, index) => (
                <input
                  key={key}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={verifyNumber[key as keyof VerifyNumber]}
                  onChange={e => handleInputChange(index, e.target.value)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-black border-2 text-center text-lg font-semibold rounded-md outline-none transition ${invalidError ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500`}
                />
              ))}
            </div>
            <button
              onClick={verify}
              disabled={isLoading}
              className="w-full items-center rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <SpinnerMini /> : 'Verify'}
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

          {/* Right: Visual */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
}
