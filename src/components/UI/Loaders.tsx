import React from "react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  ...props
}) => (
  <button
    {...props}
    disabled={loading}
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      props.className || ""
    }`}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <span className="ml-2">Loading...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

export const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="relative">
      <div className="w-20 h-20 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      <div className="w-20 h-20 border-t-4 border-b-4 border-blue-300 rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);
