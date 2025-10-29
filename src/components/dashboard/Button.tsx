import React from 'react';
import { PlusCircle } from 'lucide-react';

interface ButtonProps {
    onClick: () => void;
    label?: string;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label = 'Create Quiz', className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md h-[42px] whitespace-nowrap flex-shrink-0 ${className}`}
        >
            <PlusCircle size={18} className="mr-1.5 flex-shrink-0" />
            {label}
        </button>
    );
};

export default Button;
