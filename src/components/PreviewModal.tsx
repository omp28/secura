import React from "react";

type File = {
  id: string;
  name: string;
  type: string;
  size: string;
};

type PreviewModalProps = {
  file: File;
  onClose: () => void;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Preview: {file.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div className="mt-4">
          {file.type === "Image" && (
            <img
              src={`/${file.name}`} // Accessing image from public folder
              alt={file.name}
              className="max-w-full max-h-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
