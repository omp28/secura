import React, { useEffect, useState } from "react";
import useFileStore from "../store/useFileStore";
import FullscreenModal from "./UI/FullscreenModal";
import useAuthStore from "../store/useAuthStore";

const UploadedFiles: React.FC = () => {
  const { files, fetchFiles, deleteAllFiles } = useFileStore();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const { userID } = useAuthStore();

  useEffect(() => {
    if (userID) {
      fetchFiles(userID);
    }
  }, [userID, fetchFiles]);

  const openFullscreen = (imageData: string) => {
    setFullscreenImage(imageData);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const handleDeleteAll = () => {
    if (
      userID &&
      window.confirm("Are you sure you want to delete all files?")
    ) {
      deleteAllFiles(userID);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold">Uploaded Files:</h2>
      <ul className="mt-3 space-y-4">
        {files.map((file, index) => (
          <li key={file._id || index} className="flex items-center">
            {file.fileType.startsWith("image/") ? (
              <img
                src={file.fileData}
                alt={file.filename}
                className="w-24 h-24 mr-4 cursor-pointer object-cover"
                onClick={() => openFullscreen(file.fileData)}
              />
            ) : (
              <a
                href={file.fileData}
                download={file.filename}
                className="text-blue-500 hover:underline mr-4"
              >
                {file.filename}
              </a>
            )}
            <a
              download
              href={file.fileData}
              className="text-blue-500 hover:underline"
            >
              Download
            </a>
          </li>
        ))}
      </ul>

      <button
        onClick={handleDeleteAll}
        className="mt-5 text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded"
      >
        Delete All Files
      </button>

      {fullscreenImage && (
        <FullscreenModal imageSrc={fullscreenImage} onClose={closeFullscreen} />
      )}
    </div>
  );
};

export default UploadedFiles;
