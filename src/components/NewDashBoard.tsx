import React, { useState, useEffect } from "react";
import NestedFileExplorer from "./NestedFileExplorer";
import PreviewModal from "./PreviewModal";

type File = {
  id: string;
  name: string;
  type: "Document" | "Image" | "Spreadsheet" | "PDF" | "Video" | "Folder";
  size: string;
  children?: File[];
};

export default function NewDashBoard() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    setFiles([
      {
        id: "1",
        name: "Documents",
        size: "23",
        type: "Folder",
        children: [
          { id: "2", name: "Document1.docx", type: "Document", size: "2.3 MB" },
          {
            id: "3",
            name: "Spreadsheet1.xlsx",
            type: "Spreadsheet",
            size: "500 KB",
          },
        ],
      },
      {
        id: "4",
        name: "Media",
        type: "Folder",
        size: "23",
        children: [
          { id: "5", name: "image123.jpg", type: "Image", size: "1.5 MB" },
          { id: "6", name: "video.mp4", type: "Video", size: "20 MB" },
        ],
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessKey");
    window.location.href = "/";
  };

  // Trigger preview when a non-folder file is selected
  const handleFileAction = (action: string, file: File) => {
    if (action === "preview" && file.type !== "Folder") {
      setPreviewFile(file);
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const addFile = (parentId: string, newFile: File) => {
    const addToFiles = (currentFiles: File[]): File[] => {
      return currentFiles.map((file) => {
        if (file.id === parentId) {
          return {
            ...file,
            children: file.children ? [...file.children, newFile] : [newFile],
          };
        }
        if (file.children) {
          return { ...file, children: addToFiles(file.children) };
        }
        return file;
      });
    };
    setFiles(addToFiles(files));
  };

  const renameFile = (id: string, newName: string) => {
    const updateFiles = (fileList: File[]): File[] => {
      return fileList.map((file) => {
        if (file.id === id) {
          return { ...file, name: newName };
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) };
        }
        return file;
      });
    };
    setFiles(updateFiles(files));
  };

  const deleteFile = (id: string) => {
    const deleteFromFiles = (currentFiles: File[]): File[] => {
      return currentFiles
        .filter((file) => file.id !== id)
        .map((file) =>
          file.children
            ? { ...file, children: deleteFromFiles(file.children) }
            : file
        );
    };
    setFiles(deleteFromFiles(files));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-20">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Your Files Are Here!</h2>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Log Out
          </button>
        </div>

        <NestedFileExplorer
          files={files}
          onFileAction={handleFileAction}
          addFile={addFile}
          deleteFile={deleteFile}
          renameFile={renameFile}
        />

        {/* {previewFile && (
          <PreviewModal file={previewFile} onClose={handleClosePreview} />
        )} */}
      </div>
    </div>
  );
}
