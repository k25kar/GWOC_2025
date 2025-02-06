import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'ghost', className, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded';
  const variantStyles = {
    ghost: 'bg-transparent text-gray-200 hover:text-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-100',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className || '')}
      {...props}
    />
  );
};
