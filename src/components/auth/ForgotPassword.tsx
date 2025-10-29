'use client';

import React from 'react';
import Image from 'next/image';
import login_background from '@/public/assets/home/login-bg.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useModal } from '@/context/ModalContext';
import { useToast } from '@/hooks/use-toast';
import { useForgotPasswordMutation } from '@/lib/redux/features/auth/authApi';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import { Input } from './InputField';
import { X } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type FormData = z.infer<typeof formSchema>;

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

export default function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const { showModal } = useModal();
  const { toast } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      localStorage.setItem('reset_email', values.email);

      toast({
        variant: 'success',
        title: 'Email sent!',
        description: 'Check your inbox for the reset code.',
      });
      showModal('verifyResetCode');
    } catch (e: unknown) {
      let errorMessage = 'Failed to send reset email';
      if (typeof e === 'object' && e !== null) {
        const err = e as ApiError;
        if (err.data && typeof err.data.message === 'string') {
          errorMessage = err.data.message;
        }
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-inter">
      <div className="relative w-full max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        {/* Background Image */}
        <Image
          src={login_background}
          alt="Forgot password background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full rounded-3xl">
          {/* Left: Form */}
          <div className="w-full md:w-1/2 p-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#ededed] hover:text-black text-xl hover:cursor-pointer transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-bold mb-2 text-gray-900 text-left">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email to receive the reset code.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register('email')} type="email" placeholder="Your email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50"
              >
                {isLoading ? <SpinnerMini /> : 'Send Reset Code'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-700">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => showModal('login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
}
