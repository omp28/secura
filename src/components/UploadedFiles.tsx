import React, { useEffect, useState } from "react";
import axios from "axios";
import FullscreenModal from "./UI/FullscreenModal";

interface UploadedFile {
  _id?: string;
  filename: string;
  fileType: string;
  fileData: string;
}

const UploadedFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const securaUserID = localStorage.getItem("securaUserID");

  useEffect(() => {
    const fetchFiles = async () => {
      console.log("Fetching files for userID:", securaUserID);

      if (!securaUserID) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/files/getfiles/${securaUserID}`
        );
        setUploadedFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [securaUserID]);

  console.log("Uploaded files:", uploadedFiles);

  const openFullscreen = (imageData: string) => {
    setFullscreenImage(imageData);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold">Uploaded Files:</h2>
      <ul className="mt-3 space-y-4">
        {uploadedFiles.map((file, index) => (
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

      {fullscreenImage && (
        <FullscreenModal imageSrc={fullscreenImage} onClose={closeFullscreen} />
      )}
    </div>
  );
};

export default UploadedFiles;
