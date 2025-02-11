import React from 'react';
import classNames from 'classnames';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const badgeClass = classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', {
    'bg-blue-100 text-blue-800': variant === 'default',
    'bg-gray-100 text-gray-800': variant === 'secondary',
  });

  return <span className={badgeClass}>{children}</span>;
}
