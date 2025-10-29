'use client';

import Image from 'next/image';
import login_background from '@/public/assets/home/login-bg.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useModal } from '@/context/ModalContext';
import { useToast } from '@/hooks/use-toast';
import { useRegisterMutation } from '@/lib/redux/features/auth/authApi';

import { Input } from './InputField';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import SocialLogin from './SocialLogin';
import PasswordField from './PasswordField';
import { User, X } from 'lucide-react';

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(/(?:.*[A-Za-z]){3,}/, { message: 'Name must contain at least 3 letters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[!@#$%^&*]/, 'Must include a special character'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

// --- START OF CHANGES ---
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

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const { showModal } = useModal();
  const { toast } = useToast();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Registration successful!',
      });

      showModal('verifyCode');
    } catch (e: unknown) {
      // --- CHANGED err: any to e: unknown ---
      // --- START OF CHANGES ---
      // Type check and cast the error object
      let errorMessage = 'Registration failed';
      if (typeof e === 'object' && e !== null) {
        const err = e as ApiError; // Cast to ApiError
        if (err.data && typeof err.data.message === 'string') {
          errorMessage = err.data.message;
        }
      }
      // --- END OF CHANGES ---

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/1 px-4 backdrop-blur-xs font-inter">
      <div className="relative w-[100%] max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={login_background}
          alt="Sign up background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="relative z-10 flex flex-col md:flex-row rounded-3xl">
          {' '}
          {/* Changed z-70 to z-10 for more standard layering */}
          <div className="w-full md:w-1/2 p-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#ededed] hover:text-black text-xl hover:cursor-pointer transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-left">Sign Up</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('name')}
                placeholder="Full Name"
                icon={<User className="w-5 h-5" />}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

              <Input {...register('email')} placeholder="Email" type="email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <PasswordField {...register('password')} placeholder="Password" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              <PasswordField {...register('confirmPassword')} placeholder="Confirm Password" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50"
              >
                {isLoading ? <SpinnerMini /> : 'Create Account'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-2 text-sm text-gray-600">
              <div className="h-px flex-1 bg-gray-300" />
              <span>Or sign up with</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <SocialLogin />

            <div className="mt-6 text-center text-sm text-gray-700">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => showModal('login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
