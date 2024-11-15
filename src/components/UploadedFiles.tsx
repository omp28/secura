import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";

import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
} from "lucide-react";

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

export default function UploadedFiles() {
  const { userID } = useAuthStore();
  const [data, setData] = useState<{ folders: Folder[]; files: File[] }>({
    folders: [],
    files: [],
  });
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/files/delete-all`,
        {
          data: { userID, folderID: currentFolder || null },
        }
      );
      fetchData();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const renderTree = (parentFolderID: string | null, depth = 0) => {
    const folders = data.folders.filter(
      (folder) => folder.parentFolderID === parentFolderID
    );
    const files = data.files.filter((file) => file.folderID === parentFolderID);

    return (
      <ul className={`space-y-1 ${depth > 0 ? "ml-4" : ""}`}>
        {folders.map((folder) => (
          <li key={folder._id}>
            <div
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-700 rounded p-1"
              onClick={() => toggleFolder(folder._id)}
            >
              {expandedFolders.has(folder._id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} className="text-blue-400" />
              <span onClick={() => setCurrentFolder(folder._id)}>
                {folder.name}
              </span>
            </div>
            {expandedFolders.has(folder._id) &&
              renderTree(folder._id, depth + 1)}
          </li>
        ))}
        {files.map((file) => (
          <li key={file._id}>
            <div
              className="flex items-center space-x-1 cursor-pointer hover:bg-gray-700 rounded p-1 ml-5"
              onClick={() => setSelectedFile(file)}
            >
              <File size={16} className="text-gray-400" />
              <span>{file.fileName}</span>
            </div>
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
    <div className="flex w-full bg-gray-900 text-gray-100">
      <div className="w-1/3 p-4 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-4">File Explorer</h1>
        <div className="space-y-2 mb-4">
          <Button
            onClick={() => createFolder(prompt("Enter folder name:") || "")}
            className="w-full"
          >
            <Plus size={16} className="mr-2" /> New Folder
          </Button>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              multiple
              onChange={(e) => uploadFile(e.target.files as FileList)}
              className="file-input"
            />
            <Button
              onClick={() =>
                document.querySelector<HTMLInputElement>(".file-input")?.click()
              }
            >
              <Upload size={16} className="mr-2" /> Upload
            </Button>
          </div>
          {currentFolder && (
            <Button onClick={navigateUp} variant="outline" className="w-full">
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </Button>
          )}
          <Button
            onClick={deleteAllFiles}
            variant="destructive"
            className="w-full"
          >
            <Trash2 size={16} className="mr-2" /> Delete All Files
          </Button>
        </div>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(100vh-300px)]">
          {renderTree(currentFolder)}
        </ScrollArea>
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">File Preview</h2>
        {selectedFile ? (
          <div>
            <h3 className="text-lg font-medium mb-2">
              {selectedFile.fileName}
            </h3>
            {selectedFile.fileType.startsWith("image/") ? (
              <img
                src={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`}
                alt={selectedFile.fileName}
                className="max-w-full h-auto"
              />
            ) : selectedFile.fileType === "application/pdf" ? (
              <iframe
                src={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`}
                className="w-full h-[calc(100vh-200px)]"
                title={selectedFile.fileName}
              />
            ) : (
              <div className="bg-gray-800 p-4 rounded">
                <p>Preview not available for this file type.</p>
                <a
                  href={`data:${selectedFile.fileType};base64,${selectedFile.fileData}`}
                  download={selectedFile.fileName}
                  className="text-blue-400 hover:underline mt-2 inline-block"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        ) : (
          <p>Select a file to preview</p>
        )}
      </div>
    </div>
  );
}
