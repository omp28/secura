import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const FileUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { userID, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please log in again.");
      return;
    }
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    if (userID) {
      formData.append("userID", userID);
    } else {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Files uploaded successfully!");
    } catch (error: any) {
      alert("Error uploading files: " + error.message);
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button
        className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
