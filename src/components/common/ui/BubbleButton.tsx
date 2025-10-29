import React, { ReactNode, MouseEvent } from 'react';

interface BubbleButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const BubbleButton: React.FC<BubbleButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        font-sans text-white bg-[#0c66ed]
        py-1 px-4 border-none rounded-[0.3rem]
        relative cursor-pointer overflow-hidden
        transition-all duration-300
        hover:shadow-lg
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Bubble circles */}
      <span
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[30px] w-[30px] bg-[#171717] rounded-full
          transition-[transform] duration-500 ease-in-out
          transform -translate-x-[3.3em] -translate-y-[4em]
          ${disabled ? 'hidden' : ''}
        `}
      />
      <span
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[30px] w-[30px] bg-[#171717] rounded-full
          transition-[transform] duration-500 ease-in-out
          transform -translate-x-[6em] translate-y-[1.3em]
          ${disabled ? 'hidden' : ''}
        `}
      />
      <span
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[30px] w-[30px] bg-[#171717] rounded-full
          transition-[transform] duration-500 ease-in-out
          transform -translate-x-[0.2em] translate-y-[1.8em]
          ${disabled ? 'hidden' : ''}
        `}
      />
      <span
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[30px] w-[30px] bg-[#171717] rounded-full
          transition-[transform] duration-500 ease-in-out
          transform translate-x-[3.5em] translate-y-[1.4em]
          ${disabled ? 'hidden' : ''}
        `}
      />
      <span
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[30px] w-[30px] bg-[#171717] rounded-full
          transition-[transform] duration-500 ease-in-out
          transform translate-x-[3.5em] -translate-y-[3.8em]
          ${disabled ? 'hidden' : ''}
        `}
      />

      {/* Button text */}
      <span className="relative">{children}</span>

      {/* Hover effect */}
      <style jsx>{`
        button:hover span:not(:last-child) {
          transform: translate(-50%, -50%) scale(4);
          transition: transform 1.5s ease;
        }
      `}</style>
    </button>
  );
};

export default BubbleButton;
