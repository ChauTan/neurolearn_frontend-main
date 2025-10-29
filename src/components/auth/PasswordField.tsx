import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <Lock className="w-5 h-5" />
      </span>
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        {...props}
        // Dọn dẹp className: loại bỏ khoảng trắng thừa ở cuối và gộp các nhóm class
        className={`w-full rounded-xl bg-white pl-11 pr-10 py-3 text-gray-900 placeholder-gray-400 border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 autofill:shadow-[inset_0_0_0_1000px_white] ${props.className || ''}`}
        // fix cứng màu trắng dành riêng cho auth (đã có trong className)
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md p-1" // Thêm focus style và padding nhỏ cho vùng click
        aria-label={show ? 'Hide password' : 'Show password'} // Cải thiện accessibility
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
});

PasswordField.displayName = 'PasswordField';
export default PasswordField;
