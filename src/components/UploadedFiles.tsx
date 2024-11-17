import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import PreviewModal from "./UI/PreviewModal";

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
  fileData: {
    type: string;
    data: number[];
  };
}

const UploadedFiles: React.FC = () => {
  const { userID } = useAuthStore();
  const [data, setData] = useState<{ folders: Folder[]; files: File[] }>({
    folders: [],
    files: [],
  });
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchData();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const deleteFile = async (fileID: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/files/file/${fileID}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const deleteAllFilesAndFolders = async () => {
    if (!userID) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all files and folders in your account?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/files/delete-all/${userID}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting all files and folders:", error);
    }
  };

  const deleteFolder = async (folderID: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder and all its contents?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/folders/${folderID}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting folder:", error);
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
              <button
                onClick={() => deleteFolder(folder._id)}
                className="text-red-500 hover:underline ml-2"
              >
                🗑️ Delete
              </button>
              {renderTree(folder._id)}
            </li>
          ))}
        {data.files
          .filter((file) => file.folderID === parentFolderID)
          .map((file) => (
            <li key={file._id} className="flex items-center space-x-2">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() =>
                  setPreviewFile({
                    _id: file._id,
                    fileName: file.fileName,
                    fileType: file.fileType,
                    folderID: file.folderID,
                    fileData: file.fileData,
                  })
                }
              >
                📄 {file.fileName}
              </span>
              <button
                onClick={() => deleteFile(file._id)}
                className="text-red-500 hover:underline ml-2"
              >
                🗑️ Delete
              </button>
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
    <div className="p-5 max-w-4xl mx-auto bg-gray-900 shadow-md rounded-lg">
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
          onClick={deleteAllFilesAndFolders}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete All Files and Folders
        </button>
      </div>

      <div>{renderTree(currentFolder)}</div>

      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default UploadedFiles;
