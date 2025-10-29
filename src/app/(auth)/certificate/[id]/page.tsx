"use client"

import CertificateDetail from '@/components/certificate/CertificateDetail';
import { useCertificateById } from '@/hooks/useCertificate';
import { useParams } from 'next/navigation';
import React from 'react';

export default function Page() {
    const params = useParams();
    const certificateId = params.id as string;

    const { certificate, loading, error } = useCertificateById(certificateId);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-semibold mb-2">Error loading certificate</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <CertificateDetail certificate={certificate} />
        </div>
    );
}
