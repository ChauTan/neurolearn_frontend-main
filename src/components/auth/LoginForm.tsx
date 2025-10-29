'use client';

import { useState } from 'react';
import Image from 'next/image';
import login_background from '@/public/assets/home/login-bg.png';
import { Input } from './InputField';
import PasswordField from './PasswordField';
import SocialLogin from './SocialLogin';
import { useModal } from '@/context/ModalContext';
import { useLoginMutation } from '@/lib/redux/features/auth/authApi';
import { X } from 'lucide-react';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: LoginFormProps) => {
  const { showModal } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const { refetch } = useLoadUserQuery({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      await refetch();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/10 px-4 backdrop-blur-xs font-inter">
      <div className="relative w-full max-w-5xl h-[600px] bg-white overflow-hidden rounded-3xl shadow-xl">
        {/* Background Image */}
        <Image
          src={login_background}
          alt="Login background"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          priority
          quality={100}
          sizes="100vw"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full rounded-3xl">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 p-10 ">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#ededed] hover:text-black text-xl hover:cursor-pointer transition-colors duration-200"
              aria-label="Close login modal"
            >
              <X className="h-6 w-6 " />
            </button>

            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-left">Login</h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {'data' in error
                  ? (error.data as { message?: string })?.message || 'Login failed'
                  : 'Login failed'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <PasswordField
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div className="flex justify-end text-sm font-medium">
                <button
                  type="button"
                  onClick={() => showModal('forgotPassword')}
                  className="text-gray-800 hover:underline"
                >
                  Forgot password ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gray-800 py-3 text-white font-semibold transition hover:bg-gray-900 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-2 text-sm text-gray-600">
              <div className="h-px flex-1 bg-gray-300" />
              <span>Or sign in with</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            <SocialLogin />

            <div className="mt-6 text-center text-sm text-gray-700">
              You do not have an account?{' '}
              <button
                type="button"
                onClick={() => showModal('signup')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden md:block md:w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
