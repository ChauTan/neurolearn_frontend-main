import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary button - solid blue
        default: 'bg-[#3858F8] text-white hover:bg-[#2C48E0] shadow-sm hover:shadow-md',

        // Secondary button - white with blue text
        primary: 'bg-white text-[#3858F8] hover:bg-[#F7F8FA] shadow-sm hover:shadow-md',

        // Destructive button - red
        destructive: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm hover:shadow-md',

        // Outline button - blue border
        outline: 'border border-[#3858F8] bg-transparent text-[#3858F8] hover:bg-[#3858F8]/10',

        // Rounded outline button
        outline2: 'border border-[#3858F8] bg-transparent text-[#3858F8] hover:bg-[#3858F8]/10 rounded-full',

        // Secondary blue button
        secondary: 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-sm hover:shadow-md',

        // Ghost button - minimal style
        ghost: 'text-[#3858F8] hover:bg-[#F7F8FA] hover:text-[#2C48E0]',

        // Rounded ghost button
        ghost2: 'text-[#3858F8] hover:bg-[#F7F8FA] hover:text-[#2C48E0] rounded-full',

        // Active tab style
        'active-tab': 'bg-foreground text-black shadow',

        // Hero button - special style for prominent CTAs
        hero: 'bg-[#3858F8] text-white hover:bg-[#2C48E0] rounded-full shadow-lg hover:shadow-xl'
      },
      size: {
        // Default size - medium rounded corners
        default: 'rounded-lg px-6 py-2.5',

        // Combobox size - smaller for dropdowns
        combobox: 'rounded-lg px-3 py-2',

        // Fully rounded size
        rounded: 'rounded-full px-6 py-2.5',

        // Extra small size
        xs: 'rounded-lg py-1.5 px-2.5 text-xs',

        // Small size
        sm: 'rounded-lg py-2 px-4 text-sm',

        // Large size
        lg: 'rounded-lg px-8 py-3 text-base',

        // Extra large size
        xl: 'rounded-lg px-10 py-3.5 text-base',

        // Icon button - square shape
        icon: 'h-9 w-9 rounded-lg',

        // Hero button size
        hero: 'rounded-full px-8 py-3.5 text-base'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };