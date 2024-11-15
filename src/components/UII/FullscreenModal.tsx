import React from "react";

interface FullscreenModalProps {
  imageSrc: string;
  onClose: () => void;
}

const FullscreenModal = ({ imageSrc, onClose }: FullscreenModalProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt="Fullscreen"
          className="max-w-full max-h-screen object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FullscreenModal;
