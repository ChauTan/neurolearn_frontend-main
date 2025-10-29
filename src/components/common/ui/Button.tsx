'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import Arrow from '@/public/assets/home/Arrow - Right.svg';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  showArrow?: boolean;
}

const Button = ({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  showArrow = true,
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-between rounded-full text-center';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // only render the <Image> if showArrow is true
  const ArrowIcon = showArrow ? (
    <Image src={Arrow} alt="arrow" width={14} height={14} className="ml-2" />
  ) : null;

  if (href) {
    return (
      <Link href={href} className={`${buttonStyles} px-4 py-2 gap-2`}>
        <span>{children}</span>
        {ArrowIcon}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${buttonStyles} px-4 py-2`}>
      <span>{children}</span>
      {ArrowIcon}
    </button>
  );
};

export default Button;
