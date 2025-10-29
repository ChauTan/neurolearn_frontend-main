'use client';

import React from 'react';
import Image from 'next/image';

interface AvatarWithFallbackProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
  className?: string;
  fallbackClassName?: string;
  gradientColors?: string;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt = 'avatar',
  name = 'User',
  size = 56,
  className = '',
  fallbackClassName = '',
  gradientColors = 'from-blue-500 to-purple-600'
}) => {
  const sizeStyle: React.CSSProperties = { width: size, height: size };
  const baseClassName = `rounded-full object-cover overflow-hidden ring-2 ring-white shadow-md`;
  const fallbackBaseClassName = `rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white`;

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`${baseClassName} ${className}`}
        style={sizeStyle}
      />
    );
  }

  return (
    <div className={`${fallbackBaseClassName} ${fallbackClassName}`} style={sizeStyle}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default AvatarWithFallback;
