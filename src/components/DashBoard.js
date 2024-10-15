// import React, { useState, useEffect } from "react";
// import FileTable from "./FileTable";
// import PreviewModal from "./PreviewModal";

// type File = {
//   id: string;
//   name: string;
//   type: string;
//   size: string;
// };

// export default function Dashboard() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [previewFile, setPreviewFile] = useState<File | null>(null);

//   useEffect(() => {
//     setFiles([
//       {
//         id: "1",
//         name: "Document1.docx",
//         type: "Document",
//         size: "2.3 MB",
//       },
//       { id: "2", name: "image123.jpg", type: "Image", size: "1.5 MB" },
//       {
//         id: "3",
//         name: "Spreadsheet1.xlsx",
//         type: "Spreadsheet",
//         size: "500 KB",
//       },
//       {
//         id: "4",
//         name: "sample.pdf",
//         type: "PDF",
//         size: "1 MB",
//       },
//       {
//         id: "5",
//         name: "video.mp4",
//         type: "Video",
//         size: "20 MB",
//       },
//     ]);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessKey");
//     window.location.href = "/";
//   };

//   const handleFileAction = (action: string, file: File) => {
//     if (action === "preview") {
//       setPreviewFile(file);
//     }
//   };

//   const handleClosePreview = () => {
//     setPreviewFile(null);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto mt-20">
//       <div className="bg-white shadow-md rounded-lg">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-lg font-semibold">Your Files</h2>
//           <button
//             onClick={handleLogout}
//             className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
//           >
//             Log Out
//           </button>
//         </div>

//         <FileTable files={files} onFileAction={handleFileAction} />

//         {previewFile && (
//           <PreviewModal file={previewFile} onClose={handleClosePreview} />
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import FileTable from "./FileTable";
import PreviewModal from "./PreviewModal";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    setFiles([
      {
        id: "1",
        name: "Document1.docx",
        type: "Document",
        size: "2.3 MB",
      },
      { id: "2", name: "image123.jpg", type: "Image", size: "1.5 MB" },
      {
        id: "3",
        name: "Spreadsheet1.xlsx",
        type: "Spreadsheet",
        size: "500 KB",
      },
      {
        id: "4",
        name: "sample.pdf",
        type: "PDF",
        size: "1 MB",
      },
      {
        id: "5",
        name: "video.mp4",
        type: "Video",
        size: "20 MB",
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessKey");
    window.location.href = "/";
  };

  const handleFileAction = (action, file) => {
    if (action === "preview") {
      setPreviewFile(file);
    }
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
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

        <FileTable files={files} onFileAction={handleFileAction} />

        {previewFile && (
          <PreviewModal file={previewFile} onClose={handleClosePreview} />
        )}
      </div>
    </div>
  );
}
