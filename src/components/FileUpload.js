import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getfiles`
        );
        setUploadedFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Files uploaded successfully!");
      console.log(response.data);

      const updatedFiles = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/getfiles`
      );
      setUploadedFiles(updatedFiles.data);
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

      <div style={{ marginTop: "20px" }}>
        <h2>Uploaded Files:</h2>
        <ul>
          {uploadedFiles.map((file) => (
            <li key={file.filename}>
              <img
                src={file.url}
                alt={file.filename}
                style={{ width: "100px", marginRight: "10px" }}
              />
              <a className="text-white" href={file.url} download>
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
