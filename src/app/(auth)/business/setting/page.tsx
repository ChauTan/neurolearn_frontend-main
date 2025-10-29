'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';

type Representative = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
};

type BusinessMe = {
  _id: string;
  businessName: string;
  description?: string;
  email?: string;
  address?: string;
  businessSector?: string;
  taxCode?: string;
  logo?: string;
  representative?: Representative;
  isVerified: boolean;
  employees: unknown[];
  courses: unknown[];
  createdAt: string;
};

export default function BusinessSettingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);

  const isBusinessAdmin = useMemo(() => user?.businessInfo?.role === 'admin', [user]);

  const [business, setBusiness] = useState<BusinessMe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    if (!isBusinessAdmin) {
      router.push(`/business/dashboard/${user?.businessInfo?.businessId ?? ''}`);
    }
  }, [isBusinessAdmin, router, user]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const res = await fetch(`${apiUrl}/business/me`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(text || 'Failed to load business info');
        }

        const result = await res.json();
        const b = result.business as BusinessMe;
        setBusiness(b);
        setNameInput(b?.businessName ?? '');
        setEmailInput(b?.email ?? '');
      } catch (err: any) {
        const msg = err?.message || 'Failed to load business info';
        setError(msg);
        toast({ title: 'Error', description: msg, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    if (isBusinessAdmin) {
      fetchBusiness();
    }
  }, [isBusinessAdmin, toast]);

  if (!isBusinessAdmin) {
    return <Loading message="Redirecting..." className="min-h-screen" />;
  }

  if (loading) {
    return <Loading message="Loading business info..." className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading business setting</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center text-gray-600">No business info</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left sidebar (old UI style) */}
        <aside className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 bg-white p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center self-start">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={newLogoPreview || business.logo || '/assets/images/avatar-default.png'}
              alt={business.businessName}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{business.businessName}</h1>
          <p className="text-sm text-gray-500 mt-1">Business</p>
          {business.email && (
            <p className="text-sm text-gray-600 mt-2 break-all">{business.email}</p>
          )}

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                toast({ title: 'Error', description: 'Image file is too large. Maximum 2MB.', variant: 'destructive' });
                return;
              }
              setNewLogoFile(file);
              setNewLogoPreview(URL.createObjectURL(file));
            }}
            className="hidden"
            id="logoInput"
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          <label
            htmlFor="logoInput"
            className="mt-5 bg-blue-500 hover:cursor-pointer text-white px-8 py-2.5 rounded-3xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Edit logo
          </label>
        </aside>

        {/* Right content: simple form to change business name */}
        <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
                placeholder="Enter business name"
              />
            </div>

            <div className='mb-7'>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
                placeholder="Enter business email"
              />
            </div>

            <div className="flex gap-3">
              <button
                disabled={isSaving}
                onClick={async () => {
                  if (!business) return;
                  try {
                    setIsSaving(true);
                    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI as string;
                    const body: any = {};
                    if (nameInput && nameInput.trim() && nameInput.trim() !== business.businessName) {
                      body.businessName = nameInput.trim();
                    }
                    if ((emailInput || '') !== (business.email || '')) {
                      const email = (emailInput || '').trim();
                      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
                        throw new Error('Invalid email format');
                      }
                      body.email = email;
                    }
                    if (newLogoFile) {
                      const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = (err) => reject(err);
                      });
                      body.logo = await fileToBase64(newLogoFile);
                    }

                    if (!body.businessName && !body.logo && !("email" in body)) {
                      toast({ title: 'No Changes', description: "You haven't made any changes.", variant: 'destructive' });
                      return;
                    }

                    const res = await fetch(`${apiUrl}/business/me`, {
                      method: 'PUT',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    });

                    if (!res.ok) {
                      const text = await res.text().catch(() => res.statusText);
                      throw new Error(text || 'Failed to update business');
                    }

                    const result = await res.json();
                    const updated = result.business as BusinessMe;
                    setBusiness(updated);
                    setNameInput(updated.businessName);
                    setEmailInput(updated.email || '');
                    if (newLogoPreview) URL.revokeObjectURL(newLogoPreview);
                    setNewLogoFile(null);
                    setNewLogoPreview(null);
                    toast({ title: 'Success!', description: 'Business updated.', variant: 'success' });
                  } catch (err: any) {
                    toast({ title: 'Error', description: err?.message || 'Update failed', variant: 'destructive' });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className={'px-12 py-2.5 rounded-3xl hover:cursor-pointer text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'}
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

              <button
                disabled={isSaving}
                onClick={() => {
                  setNameInput(business.businessName);
                  if (newLogoPreview) URL.revokeObjectURL(newLogoPreview);
                  setNewLogoFile(null);
                  setNewLogoPreview(null);
                }}
                className="px-10 py-2.5 hover:cursor-pointer rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
