// src/services/api/user.ts
import { User } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';

/**
 * Lấy thông tin của người dùng đang đăng nhập.
 * Yêu cầu trình duyệt gửi kèm cookie xác thực.
 */
export const getCurrentUserAPI = async (): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include', // Rất quan trọng để gửi cookie xác thực
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch user data.');
  }

  if (!data.user) {
    throw new Error('API response did not contain user data.');
  }

  return data.user;
};

/**
 * Cập nhật thông tin người dùng.
 */
export const updateCurrentUserInfoAPI = async (updatedData: Partial<User>): Promise<any> => {
  // <<-- Kiểu trả về là `any` để linh hoạt
  const apiUrl = `${API_BASE_URL}/users/update-user`;

  const res = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update user data.');
  }

  // <<-- SỬA Ở ĐÂY: Trả về toàn bộ object data -->>
  // Vì log cho thấy `data.user` là undefined, có thể API trả về { success: true, updatedUser: {...} } hoặc một cấu trúc khác.
  // Trả về cả object `data` để `page.tsx` có thể xử lý.
  return data;
};

// TODO: Thêm hàm gọi API để cập nhật mật khẩu nếu cần
// export const updateUserPasswordAPI = async (passwordData: any) => { ... };
// <<-- THÊM HÀM MỚI ĐỂ XỬ LÝ UPLOAD AVATAR -->>
/**
 * Upload ảnh đại diện mới.
 * @param avatarBase64 Chuỗi base64 của ảnh
 * @returns Thông tin user đã được cập nhật
 */
export const updateUserAvatarAPI = async (avatarBase64: string): Promise<{ user: User }> => {
  // Endpoint này cần khớp với endpoint của hàm updateProfilePicture ở backend
  const apiUrl = `${API_BASE_URL}/users/update-avatar`;

  console.log(`[DEBUG] Calling API to update avatar...`);

  const res = await fetch(apiUrl, {
    method: 'PUT', // Hoặc POST, tùy theo backend của bạn
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar: avatarBase64 }), // Gửi đi dưới dạng { avatar: "data:image/..." }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update avatar.');
  }
  return data;
};
