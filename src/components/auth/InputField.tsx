// import * as React from 'react';

// import { cn } from '@/lib/utils';

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           'border-[0.5px] text-black rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring'
//           , className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Input.displayName = 'Input';

// export { Input };
import * as React from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, ...props }, ref) => {
    return (
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon || <Mail className="w-5 h-5" />}
        </span>
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            'w-full rounded-xl bg-white pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400',
            'border border-gray-300 shadow-sm outline-none',
            'focus:ring-2 focus:ring-gray-400 focus:border-gray-400',
            'autofill:shadow-[inset_0_0_0_1000px_white]',// fix cứng màu trắng dành riêng cho auth
            className
          )}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
