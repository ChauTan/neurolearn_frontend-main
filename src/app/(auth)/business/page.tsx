import { redirect } from 'next/navigation';

export default function BusinessPage() {
  // Lệnh này sẽ ngay lập tức chuyển hướng người dùng đến trang dashboard
  redirect('/business/dashboard');

  // Trình duyệt sẽ không bao giờ render phần bên dưới
  // vì đã được chuyển hướng.
}
