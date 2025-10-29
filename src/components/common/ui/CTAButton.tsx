import React from 'react';

interface CtaButtonProps {
  text: string;
  onClick?: () => void;
}

export default function CtaButton({ text, onClick }: CtaButtonProps) {
  return (
    <button onClick={onClick} className="border-none bg-none cursor-pointer flex items-center">
      <span
        className="relative text-black  tracking-widest  pt-1.5 pb-1.5
          after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-black after:bottom-0 after:left-0
          after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-200 after:ease-out
          hover:after:origin-bottom-left hover:after:scale-x-100
        "
      >
        {text}
      </span>
    </button>
  );
}
