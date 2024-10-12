import React, { useState, useEffect } from "react";
import FileTable from "./FileTable";
import PreviewModal from "./PreviewModal";

type File = {
  id: string;
  name: string;
  type: string;
  size: string;
};

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null); // State for file preview

  useEffect(() => {
    // Simulating fetching file list from local storage
    setFiles([
      {
        id: "1",
        name: "Document1.docx",
        type: "Word Document",
        size: "2.3 MB",
      },
      { id: "2", name: "image123.jpg", type: "Image", size: "1.5 MB" }, // Image in public folder
      {
        id: "3",
        name: "Spreadsheet1.xlsx",
        type: "Excel Spreadsheet",
        size: "500 KB",
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessKey");
    window.location.href = "/";
  };

  const handleFileAction = (action: string, file: File) => {
    if (action === "preview" && file.type === "Image") {
      setPreviewFile(file); // Set file for preview
    }
    // Handle other actions (download, share) as needed
  };

  const handleClosePreview = () => {
    setPreviewFile(null); // Close the preview
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-20">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Your Files</h2>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Log Out
          </button>
        </div>

        {/* File Table */}
        <FileTable files={files} onFileAction={handleFileAction} />

        {/* Preview Modal */}
        {previewFile && (
          <PreviewModal file={previewFile} onClose={handleClosePreview} />
        )}
      </div>
    </div>
  );
}
