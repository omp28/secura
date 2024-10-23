import React, { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { userID } = useAuthStore();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles([...e.target.files]);
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
    formData.append("userID", userID);

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
      console.log(response.data);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
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
