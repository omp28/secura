import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

interface Folder {
  _id: string;
  name: string;
  parentFolderID: string | null;
}

interface File {
  _id: string;
  fileName: string;
  fileType: string;
  folderID: string | null;
  fileData: string;
}

const UploadedFiles: React.FC = () => {
  const { userID } = useAuthStore();
  const [data, setData] = useState<{ folders: Folder[]; files: File[] }>({
    folders: [],
    files: [],
  });
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/folders/${userID}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createFolder = async (name: string) => {
    if (!name.trim()) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/folders`, {
        userID,
        name,
        parentFolderID: currentFolder,
      });
      fetchData();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const uploadFile = async (files: FileList) => {
    if (!files || !userID) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("userID", userID);
    if (currentFolder) formData.append("folderID", currentFolder);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/files/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const deleteAllFiles = async () => {
    if (!userID) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete all files ${
        currentFolder ? "in this folder" : "in your account"
      }?`
    );
    if (!confirmDelete) return;

    try {
      console.log("user detail", userID, currentFolder);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/files/delete-all/${userID}`,
        {
          data: { folderID: currentFolder || null },
        }
      );
      console.log("user detail", userID, currentFolder);
      fetchData();
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const renderTree = (parentFolderID: string | null) => {
    return (
      <ul className="ml-4 border-l-2 pl-4 space-y-2">
        {data.folders
          .filter((folder) => folder.parentFolderID === parentFolderID)
          .map((folder) => (
            <li key={folder._id} className="flex items-center space-x-2">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setCurrentFolder(folder._id)}
              >
                📁 {folder.name}
              </span>
              {renderTree(folder._id)}
            </li>
          ))}
        {data.files
          .filter((file) => file.folderID === parentFolderID)
          .map((file) => (
            <li key={file._id} className="flex items-center space-x-2">
              <a
                href={`data:${file.fileType};base64,${file.fileData}`}
                download={file.fileName}
                className="text-blue-600 hover:underline"
              >
                📄 {file.fileName}
              </a>
            </li>
          ))}
      </ul>
    );
  };

  const navigateUp = () => {
    if (!currentFolder) return;
    const parent = data.folders.find((folder) => folder._id === currentFolder);
    setCurrentFolder(parent?.parentFolderID || null);
  };

  useEffect(() => {
    if (userID) fetchData();
  }, [userID]);

  return (
    <div className="p-5 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5">File Explorer</h1>

      <div className="flex items-center space-x-4 mb-5">
        <button
          onClick={() => createFolder(prompt("Enter folder name:") || "")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          New Folder
        </button>
        <input
          type="file"
          multiple
          onChange={(e) => uploadFile(e.target.files as FileList)}
          className="file-input"
        />
        {currentFolder && (
          <button
            onClick={navigateUp}
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
          >
            Go Back
          </button>
        )}
        <button
          onClick={deleteAllFiles}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete All Files
        </button>
      </div>

      <div>{renderTree(currentFolder)}</div>
    </div>
  );
};

export default UploadedFiles;
