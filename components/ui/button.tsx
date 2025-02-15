import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'outline' | 'primary';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  className,
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-all';

  const variantStyles = {
    ghost: 'bg-transparent text-gray-200 hover:bg-gray-100',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-100',
    outline: 'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/30',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className || '')}
      {...props}
    />
  );
};


