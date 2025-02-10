import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

export function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
      {children}
    </div>
  );
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: AvatarProps) {
  return (
    <img
      className="h-8 w-8 rounded-full"
      src={src}
      alt={alt}
    />
  );
}