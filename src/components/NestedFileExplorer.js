// import React, { useState } from "react";
// import PreviewModal from "./PreviewModal";

// type CustomFile = {
//   id: string;
//   name: string;
//   type: "Document" | "Image" | "Spreadsheet" | "PDF" | "Video" | "Folder";
//   size: string;
//   children?: CustomFile[];
// };

// interface NestedFileExplorerProps {
//   files: CustomFile[];
//   onFileAction: (action: string, file: CustomFile) => void;
//   addFile: (parentId: string, newFile: CustomFile) => void;
//   deleteFile: (id: string) => void;
//   renameFile: (id: string, newName: string) => void;
// }

// const AddFileModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (newFile: CustomFile) => void;
//   parentFile: CustomFile;
//   isFolder: boolean;
// }> = ({ isOpen, onClose, onSubmit, parentFile, isFolder }) => {
//   const [newFileName, setNewFileName] = useState<string>("");
//   const [newFileType, setNewFileType] = useState<
//     "Document" | "Image" | "Spreadsheet" | "PDF" | "Video" | "Folder"
//   >("Document");
//   const [newFile, setNewFile] = useState<File | null>(null);
//   const [fileSize, setFileSize] = useState<string>("");

//   const handleSubmit = () => {
//     const newFileData: CustomFile = {
//       id: Math.random().toString(),
//       size: newFile
//         ? `${(newFile.size / (1024 * 1024)).toFixed(2)} MB`
//         : "0 MB",
//       name: newFileName,
//       type: isFolder ? "Folder" : newFileType,
//       children: isFolder ? [] : undefined,
//     };
//     onSubmit(newFileData);
//     onClose();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setNewFile(file);
//       setNewFileName(file.name);
//       setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`); // Size in MB
//       setNewFileType(getFileType(file.type)); // Get type based on file
//     }
//   };

//   const getFileType = (mimeType: string): CustomFile["type"] => {
//     if (mimeType.startsWith("image/")) return "Image";
//     if (mimeType.startsWith("application/pdf")) return "PDF";
//     if (mimeType.startsWith("application/vnd.ms-excel")) return "Spreadsheet";
//     if (
//       mimeType.startsWith(
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       )
//     )
//       return "Spreadsheet";
//     if (mimeType.startsWith("video/")) return "Video";
//     return "Document"; // Default type for unknown file types
//   };

//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
//         <h2 className="text-xl font-bold mb-4">
//           Add {isFolder ? "Folder" : "File"} to {parentFile.name}
//         </h2>
//         <input
//           type="text"
//           value={newFileName}
//           onChange={(e) => setNewFileName(e.target.value)}
//           placeholder={`New ${isFolder ? "folder" : "file"} name`}
//           className="border p-2 rounded-md w-full mb-4"
//         />
//         {!isFolder && (
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="border p-2 rounded-md w-full mb-4"
//           />
//         )}
//         <div className="flex justify-end space-x-2">
//           <button
//             className="px-4 py-2 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90"
//             onClick={handleSubmit}
//             disabled={isFolder && !newFileName}
//           >
//             Add
//           </button>
//         </div>
//         {/* Display file size and type if a file is uploaded */}
//         {newFile && !isFolder && (
//           <div className="mt-4">
//             <p>
//               <strong>File Size:</strong> {fileSize} <strong>Type:</strong>{" "}
//               {newFileType}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default function NestedFileExplorer({
//   files,
//   onFileAction,
//   addFile,
//   deleteFile,
//   renameFile,
// }: NestedFileExplorerProps) {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [isFolder, setIsFolder] = useState<boolean>(false);
//   const [currentParent, setCurrentParent] = useState<CustomFile | null>(null);
//   const [previewFile, setPreviewFile] = useState<CustomFile | null>(null);
//   const [editingFileId, setEditingFileId] = useState<string | null>(null);
//   const [editedName, setEditedName] = useState<string>("");

//   const openModal = (file: CustomFile, folder: boolean) => {
//     setCurrentParent(file);
//     setIsFolder(folder);
//     setModalOpen(true);
//   };

//   const closeModal = () => setModalOpen(false);

//   const openPreview = (file: CustomFile) => {
//     setPreviewFile(file);
//   };

//   const closePreview = () => setPreviewFile(null);

//   const toggleEditing = (file: CustomFile) => {
//     setEditingFileId(file.id);
//     setEditedName(file.name);
//   };

//   const handleRename = (file: CustomFile) => {
//     renameFile(file.id, editedName);
//     setEditingFileId(null);
//   };

//   const [expandedFiles, setExpandedFiles] = useState<{ [id: string]: boolean }>(
//     {}
//   );

//   const toggleExpansion = (fileId: string) => {
//     setExpandedFiles((prev) => ({
//       ...prev,
//       [fileId]: !prev[fileId],
//     }));
//   };

//   const renderFileTree = (fileList: CustomFile[]) => {
//     return (
//       <ul>
//         {fileList.map((file) => (
//           <li key={file.id} className="p-2">
//             <div
//               className={`flex justify-between items-center p-2 rounded-md px-4 ${
//                 file.type === "Folder" ? "bg-gray-100" : ""
//               }`}
//             >
//               <div className="flex items-center">
//                 <span className="mr-2">
//                   {file.type === "Folder" ? (
//                     <i className="fas fa-folder text-yellow-500"></i>
//                   ) : (
//                     <i className="fas fa-file-alt text-blue-500"></i>
//                   )}
//                 </span>
//                 {editingFileId === file.id ? (
//                   <input
//                     type="text"
//                     value={editedName}
//                     onChange={(e) => setEditedName(e.target.value)}
//                     onBlur={() => handleRename(file)}
//                     className="border-b p-1"
//                   />
//                 ) : (
//                   <span
//                     className="cursor-pointer"
//                     onClick={() =>
//                       file.type === "Folder"
//                         ? toggleExpansion(file.id)
//                         : openPreview(file)
//                     }
//                   >
//                     {file.name}
//                     {file.type !== "Folder" ? (
//                       <>
//                         <button
//                           className=" px-2 rounded-md ml-4 border-[1px] border-black"
//                           onClick={() => openPreview(file)}
//                         >
//                           Preview
//                         </button>
//                         <span className="ml-2 text-sm text-gray-500">
//                           {file.size} | {file.type}
//                         </span>
//                       </>
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 {file.type === "Folder" && (
//                   <>
//                     <button
//                       onClick={() => openModal(file, false)}
//                       className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
//                     >
//                       Add File
//                     </button>
//                     <button
//                       onClick={() => openModal(file, true)}
//                       className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
//                     >
//                       Add Folder
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => deleteFile(file.id)}
//                   className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
//                 >
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => toggleEditing(file)}
//                   className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
//                 >
//                   Rename
//                 </button>
//               </div>
//             </div>
//             {file.type === "Folder" &&
//               file.children &&
//               expandedFiles[file.id] && (
//                 <div className="ml-4">{renderFileTree(file.children)}</div>
//               )}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const handleFileUpload = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     files.forEach((file) => {
//       const newFile: CustomFile = {
//         id: Math.random().toString(),
//         name: file.name,
//         size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, // Convert size to MB
//         type: getFileType(file.type),
//         children: undefined,
//       };
//       addFile(currentParent?.id || "", newFile); // Ensure to add under current parent
//     });
//   };

//   const getFileType = (mimeType: string): CustomFile["type"] => {
//     if (mimeType.startsWith("image/")) return "Image";
//     if (mimeType.startsWith("application/pdf")) return "PDF";
//     if (mimeType.startsWith("application/vnd.ms-excel")) return "Spreadsheet";
//     if (
//       mimeType.startsWith(
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       )
//     )
//       return "Spreadsheet";
//     if (mimeType.startsWith("video/")) return "Video";
//     return "Document"; // Default type for unknown file types
//   };

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   return (
//     <div className="p-4" onDragOver={handleDragOver} onDrop={handleFileUpload}>
//       {renderFileTree(files)}
//       {currentParent && (
//         <AddFileModal
//           isOpen={modalOpen}
//           onClose={closeModal}
//           onSubmit={(newFile) => addFile(currentParent.id, newFile)}
//           parentFile={currentParent}
//           isFolder={isFolder}
//         />
//       )}
//       {previewFile && (
//         <PreviewModal file={previewFile} onClose={closePreview} />
//       )}
//       <div className="p-4 border-2 border-dashed border-gray-400 text-center h-40 mt-10">
//         <p>Drag and drop files here to upload</p>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import PreviewModal from "./PreviewModal";

const AddFileModal = ({ isOpen, onClose, onSubmit, parentFile, isFolder }) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("Document");
  const [newFile, setNewFile] = useState(null);
  const [fileSize, setFileSize] = useState("");

  const handleSubmit = () => {
    const newFileData = {
      id: Math.random().toString(),
      size: newFile
        ? `${(newFile.size / (1024 * 1024)).toFixed(2)} MB`
        : "0 MB",
      name: newFileName,
      type: isFolder ? "Folder" : newFileType,
      children: isFolder ? [] : undefined,
    };
    onSubmit(newFileData);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFile(file);
      setNewFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`); // Size in MB
      setNewFileType(getFileType(file.type)); // Get type based on file
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("application/pdf")) return "PDF";
    if (mimeType.startsWith("application/vnd.ms-excel")) return "Spreadsheet";
    if (
      mimeType.startsWith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    )
      return "Spreadsheet";
    if (mimeType.startsWith("video/")) return "Video";
    return "Document"; // Default type for unknown file types
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Add {isFolder ? "Folder" : "File"} to {parentFile.name}
        </h2>
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder={`New ${isFolder ? "folder" : "file"} name`}
          className="border p-2 rounded-md w-full mb-4"
        />
        {!isFolder && (
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded-md w-full mb-4"
          />
        )}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90"
            onClick={handleSubmit}
            disabled={isFolder && !newFileName}
          >
            Add
          </button>
        </div>
        {newFile && !isFolder && (
          <div className="mt-4">
            <p>
              <strong>File Size:</strong> {fileSize} <strong>Type:</strong>{" "}
              {newFileType}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NestedFileExplorer({
  files,
  onFileAction,
  addFile,
  deleteFile,
  renameFile,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const openModal = (file, folder) => {
    setCurrentParent(file);
    setIsFolder(folder);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const openPreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => setPreviewFile(null);

  const toggleEditing = (file) => {
    setEditingFileId(file.id);
    setEditedName(file.name);
  };

  const handleRename = (file) => {
    renameFile(file.id, editedName);
    setEditingFileId(null);
  };

  const [expandedFiles, setExpandedFiles] = useState({});

  const toggleExpansion = (fileId) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  const renderFileTree = (fileList) => {
    return (
      <ul>
        {fileList.map((file) => (
          <li key={file.id} className="p-2">
            <div
              className={`flex justify-between items-center p-2 rounded-md px-4 ${
                file.type === "Folder" ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {file.type === "Folder" ? (
                    <i className="fas fa-folder text-yellow-500"></i>
                  ) : (
                    <i className="fas fa-file-alt text-blue-500"></i>
                  )}
                </span>
                {editingFileId === file.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={() => handleRename(file)}
                    className="border-b p-1"
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      file.type === "Folder"
                        ? toggleExpansion(file.id)
                        : openPreview(file)
                    }
                  >
                    {file.name}
                    {file.type !== "Folder" ? (
                      <>
                        <button
                          className="px-2 rounded-md ml-4 border-[1px] border-black"
                          onClick={() => openPreview(file)}
                        >
                          Preview
                        </button>
                        <span className="ml-2 text-sm text-gray-500">
                          {file.size} | {file.type}
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {file.type === "Folder" && (
                  <>
                    <button
                      onClick={() => openModal(file, false)}
                      className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
                    >
                      Add File
                    </button>
                    <button
                      onClick={() => openModal(file, true)}
                      className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
                    >
                      Add Folder
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteFile(file.id)}
                  className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleEditing(file)}
                  className="px-3 py-1 rounded-md text-sm transition-all hover:shadow-lg hover:opacity-90 border-[1px] border-black"
                >
                  Rename
                </button>
              </div>
            </div>
            {file.type === "Folder" &&
              file.children &&
              expandedFiles[file.id] && (
                <div className="ml-4">{renderFileTree(file.children)}</div>
              )}
          </li>
        ))}
      </ul>
    );
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    files.forEach((file) => {
      const newFile = {
        id: Math.random().toString(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, // Convert size to MB
        type: getFileType(file.type),
        children: undefined,
      };
      addFile(currentParent?.id || "", newFile); // Ensure to add under current parent
    });
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("application/pdf")) return "PDF";
    if (mimeType.startsWith("application/vnd.ms-excel")) return "Spreadsheet";
    if (
      mimeType.startsWith(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    )
      return "Spreadsheet";
    if (mimeType.startsWith("video/")) return "Video";
    return "Document"; // Default type for unknown file types
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="p-4" onDragOver={handleDragOver} onDrop={handleFileUpload}>
      {renderFileTree(files)}
      {currentParent && (
        <AddFileModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={(newFile) => addFile(currentParent.id, newFile)}
          parentFile={currentParent}
          isFolder={isFolder}
        />
      )}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={closePreview} />
      )}
      <div className="p-4 border-2 border-dashed border-gray-400 text-center h-40 mt-10">
        <p>Drag and drop files here to upload</p>
      </div>
    </div>
  );
}
