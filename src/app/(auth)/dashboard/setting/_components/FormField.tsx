// src/app/(auth)/dashboard/setting/_components/FormField.tsx
'use client';
import React, { useState, InputHTMLAttributes } from 'react'; // Import useState và InputHTMLAttributes
import { cn } from '@/lib/utils'; // Giữ nguyên import cn

// Mở rộng các thuộc tính input HTML tiêu chuẩn và thêm các thuộc tính tùy chỉnh của bạn
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  icon?: React.ReactNode;
  error?: string;
  // `type` prop sẽ là 'password', 'text', 'email', v.v.
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      id,
      type = 'text', // Đặt kiểu mặc định là 'text'
      placeholder,
      containerClassName,
      icon,
      className,
      error,
      ...props // Bao gồm các props của register (name, onChange, onBlur, ref)
    },
    ref
  ) => {
    // Nhận ref từ forwardRef

    // State để kiểm soát việc hiển thị/ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // Chuyển đổi loại input giữa 'password' và 'text'
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    // Xác định loại input thực tế sẽ render
    // Nếu type ban đầu là 'password' và showPassword là true, thì dùng 'text', ngược lại dùng type ban đầu
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className={cn('w-full', containerClassName)}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={inputType} // Sử dụng inputType đã được tính toán
            placeholder={placeholder}
            className={cn(
              'w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200',
              icon || type === 'password' ? 'pr-10' : '', // Tăng padding-right nếu có icon hoặc là type="password"
              className
            )}
            {...props} // Đảm bảo tất cả các props khác (bao gồm cả của register) được truyền xuống
            ref={ref} // Truyền ref từ forwardRef xuống input
          />
          {type === 'password' ? ( // Nếu là type="password", hiển thị nút eye icon
            <button
              type="button" // QUAN TRỌNG: type="button" để ngăn nút submit form
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                // Icon mắt đóng (ẩn mật khẩu) - Biểu tượng SVG đơn giản hơn
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.61c1.76-1.838 4.766-3.11 7.02-3.11 2.254 0 5.258 1.272 7.018 3.11l.006.006.004.002.002.002.002.002.002.002L20.82 12c-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7l-.004-.002-.002-.002-.002-.002-.002-.002-.006-.006Zm-.002-1.058A10.024 10.024 0 0 1 12 4.5c4.478 0 8.268 2.943 9.542 7C20.268 16.057 16.478 19 12 19c-4.477 0-8.268-2.943-9.542-7Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                // Icon mắt mở (hiện mật khẩu) - Biểu tượng SVG đơn giản hơn
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          ) : (
            icon && ( // Nếu không phải password field, và có icon được truyền vào, thì hiển thị icon đó
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {icon}
              </div>
            )
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField'; // Rất quan trọng cho forwardRef để debug tốt hơn

export default FormField;
