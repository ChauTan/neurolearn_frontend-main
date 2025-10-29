export interface Certificate {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: {
      public_id?: string;
      url?: string | null;
    };
  };
  course: {
    _id: string;
  };
  userName: string;
  courseName: string;
  completedAt: string;
  issuedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateResponse {
  data: Certificate[];
  message?: string;
} 