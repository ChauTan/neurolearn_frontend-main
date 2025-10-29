'use client'

import { ChevronDown } from 'lucide-react'
import Image from 'next/image';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function InstructorForm() {
    // State cho từng trường
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [docImages, setDocImages] = useState<File[]>([]);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const { toast } = useToast();

    // Validate các trường bắt buộc
    const validate = () => {
        const newErrors: { [key: string]: boolean } = {};

        // Kiểm tra từng field
        if (!fullName) newErrors.fullName = true;
        if (!email) newErrors.email = true;
        if (!phoneNumber) newErrors.phoneNumber = true;
        if (!dob) newErrors.dob = true;
        if (!address) newErrors.address = true;
        if (!category) newErrors.category = true;
        if (!description) newErrors.description = true;
        if (!experience) newErrors.experience = true;
        if (!role) newErrors.role = true;
        if (!company) newErrors.company = true;
        if (docImages.length === 0) newErrors.docImages = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast({
                title: 'Missing information',
                description: 'Please fill in the information completely.',
                variant: 'destructive'
            });
            return false;
        }
        if (!agree) {
            toast({
                title: 'Not agreed to terms',
                description: 'You need to agree to the terms before submitting.',
                variant: 'destructive'
            });
            return false;
        }
        return true;
    };

    // Hàm để xóa lỗi khi user bắt đầu nhập
    const clearError = (fieldName: string) => {
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phoneNumber', phoneNumber);
            formData.append('dob', dob);
            formData.append('address', address);
            formData.append('category', category);
            formData.append('description', description);
            formData.append('experience', experience);
            formData.append('role', role);
            formData.append('company', company);

            // Append files
            docImages.forEach((file) => {
                formData.append('docImages', file);
            });

            const rawBase = (process.env.NEXT_PUBLIC_SERVER_URI || '').replace(/\/$/, '');
            const baseWithApi = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
            const res = await fetch(`${baseWithApi}/request/instructor-verification`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data?.success) {
                toast({
                    title: 'Success',
                    description: 'Your request has been sent!',
                    variant: 'success'
                });
                // Reset form
                setFullName('');
                setEmail('');
                setPhoneNumber('');
                setDob('');
                setAddress('');
                setCategory('');
                setDescription('');
                setExperience('');
                setRole('');
                setCompany('');
                setDocImages([]);
                setAgree(false);
                setErrors({});
            } else {
                toast({
                    title: 'Error',
                    description: (data?.message || `Request sent failed! (${res.status})`),
                    variant: 'destructive'
                });
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Request sent failed!',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-full mx-auto  py-10 text-sm">
                <h2 className="text-2xl font-semibold text-black">Instructor Application Form</h2>
                <p className="text-gray-500 py-4">Complete the information below to submit your instructor profile.</p>
                <div className='text-black'>
                    {/* Your Detail */}
                    <div className="rounded-2xl shadow bg-white space-y-4 p-5">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-bold">Your Detail</h3>
                            </div>
                            <div className="md:col-span-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="flex flex-col space-y-1">
                                        <label htmlFor="fullName" className="font-medium">Full Name</label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter your name"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 ${errors.fullName ? 'border-2 border-red-500' : ''}`}
                                            value={fullName}
                                            onChange={e => {
                                                setFullName(e.target.value);
                                                clearError('fullName');
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
                                        <input
                                            id="phoneNumber"
                                            type="text"
                                            placeholder="Enter your phone number"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 ${errors.phoneNumber ? 'border-2 border-red-500' : ''}`}
                                            value={phoneNumber}
                                            onChange={e => {
                                                setPhoneNumber(e.target.value);
                                                clearError('phoneNumber');
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label htmlFor="email" className="font-medium">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 ${errors.email ? 'border-2 border-red-500' : ''}`}
                                            value={email}
                                            onChange={e => {
                                                setEmail(e.target.value);
                                                clearError('email');
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label htmlFor="dob" className="font-medium">Day of Birth</label>
                                        <input
                                            id="dob"
                                            type="date"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 ${errors.dob ? 'border-2 border-red-500' : ''}`}
                                            value={dob}
                                            onChange={e => {
                                                setDob(e.target.value);
                                                clearError('dob');
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col space-y-1">
                                        <label htmlFor="address" className="font-medium">Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="Enter your address"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 ${errors.address ? 'border-2 border-red-500' : ''}`}
                                            value={address}
                                            onChange={e => {
                                                setAddress(e.target.value);
                                                clearError('address');
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2 flex flex-col space-y-1">
                                        <label htmlFor="category" className="font-medium">Subject-specific terminology</label>
                                        <div className="relative">
                                            <select
                                                id="category"
                                                className={`w-full appearance-none px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 pr-10 ${errors.category ? 'border-2 border-red-500' : ''}`}
                                                value={category}
                                                onChange={e => {
                                                    setCategory(e.target.value);
                                                    clearError('category');
                                                }}
                                            >
                                                <option value="" disabled hidden>Select</option>
                                                <option value="education">Education</option>
                                                <option value="it">Information Technology</option>
                                                <option value="finance">Finance</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="design">Design</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                <ChevronDown className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex flex-col space-y-1">
                                        <label htmlFor="desc" className="font-medium">Description</label>
                                        <textarea
                                            id="desc"
                                            rows={4}
                                            placeholder="About you"
                                            className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 ${errors.description ? 'border-2 border-red-500' : ''}`}
                                            value={description}
                                            onChange={e => {
                                                setDescription(e.target.value);
                                                clearError('description');
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Experience Section */}
                    <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-bold">Your Detail</h3>
                            </div>
                            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="experience" className="font-medium">Years of Experience</label>
                                    <input
                                        id="experience"
                                        type="text"
                                        placeholder="E.g. 5"
                                        className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 ${errors.experience ? 'border-2 border-red-500' : ''}`}
                                        value={experience}
                                        onChange={e => {
                                            setExperience(e.target.value);
                                            clearError('experience');
                                        }}
                                    />
                                </div>
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="role" className="font-medium">Previous Roles</label>
                                    <div className="relative">
                                        <select
                                            id="role"
                                            className={`w-full appearance-none px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 pr-10 ${errors.role ? 'border-2 border-red-500' : ''}`}
                                            value={role}
                                            onChange={e => {
                                                setRole(e.target.value);
                                                clearError('role');
                                            }}
                                        >
                                            <option value="" disabled hidden>e.g. Instructor, Teaching Assistant, Curriculum Developer</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="ta">Teaching Assistant</option>
                                            <option value="cd">Curriculum Developer</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 flex flex-col space-y-1">
                                    <label htmlFor="company" className="font-medium">Institutions / Companies</label>
                                    <textarea
                                        id="company"
                                        rows={4}
                                        placeholder="e.g. FPT, Coursera, FUNiX"
                                        className={`w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-0 text-gray-700 ${errors.company ? 'border-2 border-red-500' : ''}`}
                                        value={company}
                                        onChange={e => {
                                            setCompany(e.target.value);
                                            clearError('company');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Upload Certificates */}
                    <div className="rounded-2xl shadow bg-white space-y-4 p-5 mt-5">
                        <h3 className="text-lg font-bold">Upload Certificate Images</h3>
                        <div className={`mt-2 border border-dashed rounded-lg p-6 text-center text-gray-400 ${errors.docImages ? 'border-red-500' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                id="docUpload"
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files || []);
                                    setDocImages((prev) => [...prev, ...newFiles]);
                                    if (newFiles.length > 0) {
                                        clearError('docImages');
                                    }
                                }}
                            />
                            <label htmlFor="docUpload" className="cursor-pointer block">
                                Drag and drop or <span className="text-indigo-600 underline">Choose Files</span> (10MB each)
                            </label>
                        </div>
                        {docImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {docImages.map((file, index) => (
                                    <div key={index} className="relative group flex flex-col items-center space-y-2">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="rounded-lg border object-cover"
                                            width={300}
                                            height={40}
                                        />
                                        <button
                                            onClick={() =>
                                                setDocImages((prev) => prev.filter((_, i) => i !== index))
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            title="Remove"
                                            type="button"
                                        >
                                            &times;
                                        </button>
                                        <p className="text-sm text-gray-500 text-center truncate w-full px-2">
                                            {file.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Agreement */}
                    <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" id="agree" checked={agree} onChange={() => setAgree(!agree)} />
                        <label htmlFor="agree" className="text-sm">
                            I have read and agree to the <a href="https://www.termsfeed.com/live/adbfe871-bed3-4318-910d-d4062b3769fc" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800">Terms and Privacy Policy</a>.
                        </label>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300" disabled={loading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                            disabled={!agree || loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
