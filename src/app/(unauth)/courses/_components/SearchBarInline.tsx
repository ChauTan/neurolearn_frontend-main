'use client';

import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const SearchBarInline = ({ onClose }: { onClose: () => void }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const current = searchParams.get('search');
        if (current) setKeyword(current);
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (keyword.trim()) {
            params.set('search', keyword.trim());
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/courses?${params.toString()}`);
    };

    const handleClearAndClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        params.set('page', '1');

        router.push(`/courses?${params.toString()}`);
        setKeyword('');
        onClose();
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[#F7F8FA] rounded-full px-6 h-[56px] flex items-center"
        >
            <input
                type="text"
                placeholder="Search for courses..."
                className="bg-transparent outline-none px-4 py-[15px] flex-1 text-base"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoFocus
            />
            <button
                type="button"
                onClick={handleClearAndClose}
                className="ml-4 w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition"
            >
                <FaTimes className="text-black w-4 h-4" />
            </button>
        </motion.form>
    );
};

export default SearchBarInline;
