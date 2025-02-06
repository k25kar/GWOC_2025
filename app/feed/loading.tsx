import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Company Logo */}
      <Image src="/logo.svg" alt="Company Logo" width={100} height={100} className="mb-4 animate-pulse" />

      {/* Loading Text */}
      <p className="text-lg font-semibold mb-3">Loading...</p>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-progress"></div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}