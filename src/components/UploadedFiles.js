import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadedFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const securaUserID = localStorage.getItem("securaUserID");

  useEffect(() => {
    const fetchFiles = async () => {
      console.log("Fetching files for userID:", securaUserID);

      if (!securaUserID) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/files/getfiles/${securaUserID}`
        );
        setUploadedFiles(response.data); // Store the uploaded files
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [securaUserID]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Uploaded Files:</h2>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={file._id || index}>
            {" "}
            <img
              src={`${process.env.REACT_APP_API_URL}/${file.filePath}`}
              alt={file.fileName}
              style={{ width: "100px", marginRight: "10px" }}
            />
            <a
              className="text-white"
              href={`${process.env.REACT_APP_API_URL}/${file.filePath}`}
              download
            >
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedFiles;
