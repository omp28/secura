import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

interface Folder {
  _id: string;
  name: string;
  parentFolderID: string | null;
  sharedWith: string[];
}

interface File {
  _id: string;
  fileName: string;
  fileType: string;
  folderID: string | null;
  sharedWith: string[];
  fileData: {
    type: string;
    data: number[];
  };
}

export const useFiles = () => {
  const { userID, userName } = useAuthStore();
  const [data, setData] = useState<{ folders: Folder[]; files: File[] }>({
    folders: [],
    files: [],
  });
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const fetchUsernames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/usernames`
      );
      setUsernames(response.data.usernames);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

const shareItem = async (type: "files" | "folders", id: string) => {
  if (!selectedUsers.length) {
    return alert("Please select users to share with.");
  }

  try {
    const sharePromises = selectedUsers.map(async (userId) => {
      console.log('Sharing', type, id, 'with user:', userId); 
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/share/${type}/${id}`,
          {
            sharedWith: userId,
            permissions: 'read'
          }
        );
        console.log('Share response:', response.data); 
        return response.data;
      } catch (error: any) {
        console.error('Share error:', error.response?.data); 
        throw new Error(`Failed to share with user ${userId}: ${error.message}`);
      }
    });

    const results = await Promise.allSettled(sharePromises);
    console.log('Share results:', results); 
    
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some sharing operations failed:', failures);
      alert(`Some sharing operations failed. Check console for details.`);
    } else {
      alert(`${type} shared successfully`);
    }

    setSelectedUsers([]);
    fetchData();
  } catch (error: any) {
    console.error(`Error sharing ${type}:`, error);
    alert(`Error sharing ${type}. Please try again.`);
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

  const navigateUp = () => {
    if (!currentFolder) return;
    const parent = data.folders.find((folder) => folder._id === currentFolder);
    setCurrentFolder(parent?.parentFolderID || null);
  };

  useEffect(() => {
    if (userID) fetchData();
    fetchUsernames();
  }, [userID]);

  return {
    data,
    currentFolder,
    previewFile,
    searchTerm,
    usernames,
    selectedUsers,
    userName,
    setCurrentFolder,
    setPreviewFile,
    setSearchTerm,
    setSelectedUsers,
    shareItem,
    createFolder,
    uploadFile,
    deleteFile,
    deleteAllFilesAndFolders,
    deleteFolder,
    navigateUp,
  };
};