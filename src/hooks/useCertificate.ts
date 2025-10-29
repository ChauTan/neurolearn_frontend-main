import { useState, useEffect } from 'react';
import { certificateService } from '@/lib/services/certificate';
import { Certificate } from '@/types/certificate';

export const useCertificateById = (certificateId?: string) => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateId) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getCertificateById(certificateId);
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  return { certificate, loading, error };
};

export const useCertificate = (userId?: string, courseId?: string) => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !courseId) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getCertificateByUser(userId, courseId);
        setCertificate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [userId, courseId]);

  return { certificate, loading, error };
};

export const useCertificatesByCourse = (courseId?: string) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getCertificatesByCourse(courseId);
        setCertificates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [courseId]);

  return { certificates, loading, error };
};

export const useAllCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await certificateService.getAllCertificates();
        setCertificates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return { certificates, loading, error };
}; 