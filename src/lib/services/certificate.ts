import { Certificate } from '@/types/certificate';

export const certificateService = {
  // Get certificate by ID
  async getCertificateById(certificateId: string): Promise<Certificate> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/certificate/${certificateId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch certificate');
    }
    return response.json();
  },
  // Get certificates for a specific user and course
  async getCertificateByUser(userId: string, courseId: string): Promise<Certificate> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/certificate/user/${userId}/course/${courseId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch certificate');
    }
    return response.json();
  },
  // Get all certificates for a course
  async getCertificatesByCourse(courseId: string): Promise<Certificate[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/certificate/course/${courseId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }
    return response.json();
  },
  // Get all certificates
  async getAllCertificates(): Promise<Certificate[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/certificate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }
    return response.json();
  },
};
