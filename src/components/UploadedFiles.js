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

  console.log("Uploaded files:", uploadedFiles);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Uploaded Files:</h2>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={file._id || index}>
            {" "}
            <a className="text-white text-sm" href={`${file.url}`} download>
              <img
                src={`${file.url}`}
                alt={file.url}
                style={{ width: "100px", marginRight: "10px" }}
              />
            </a>
            <a download href={`${file.url}`}>
              download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedFiles;
