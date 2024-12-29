import React from "react";

interface Folder {
  _id: string;
  name: string;
  parentFolderID: string | null;
  sharedWith: string[];
}

interface File {
  _id: string;
  fileName: string;
  folderID: string | null;
  sharedWith: string[];
  fileType: string;
  fileData: {
    type: string;
    data: number[];
  };
}

interface FileTreeProps {
  data: {
    folders: Folder[];
    files: File[];
  };
  parentFolderID: string | null;
  onFolderClick: (folderId: string) => void;
  onFileClick: (file: File) => void;
  onShareItem: (type: "files" | "folders", id: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

const highlightStyle = "bg-yellow-200";

const FileTree: React.FC<FileTreeProps> = ({
  data,
  parentFolderID,
  onFolderClick,
  onFileClick,
  onShareItem,
  onDeleteFile,
  onDeleteFolder,
}) => {
  return (
    <ul className="ml-4 border-l-2 pl-4 space-y-2">
      {data.folders
        .filter((folder) => folder.parentFolderID === parentFolderID)
        .map((folder) => (
          <li
            key={folder._id}
            className={`flex items-center space-x-2 ${
              folder.sharedWith.length > 0 ? highlightStyle : ""
            }`}
          >
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => onFolderClick(folder._id)}
            >
              📁 {folder.name}
            </span>
            <button
              onClick={() => onShareItem("folders", folder._id)}
              className="text-green-500 hover:underline ml-2"
            >
              Share
            </button>
            <button
              onClick={() => onDeleteFolder(folder._id)}
              className="text-red-500 hover:underline ml-2"
            >
              Delete
            </button>
            <FileTree
              data={data}
              parentFolderID={folder._id}
              onFolderClick={onFolderClick}
              onFileClick={onFileClick}
              onShareItem={onShareItem}
              onDeleteFile={onDeleteFile}
              onDeleteFolder={onDeleteFolder}
            />
          </li>
        ))}
      {data.files
        .filter((file) => file.folderID === parentFolderID)
        .map((file) => (
          <li
            key={file._id}
            className={`flex items-center space-x-2 ${
              file.sharedWith.length > 0 ? highlightStyle : ""
            }`}
          >
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => onFileClick(file)}
            >
              📄 {file.fileName}
            </span>
            <button
              onClick={() => onShareItem("files", file._id)}
              className="text-green-500 hover:underline ml-2"
            >
              Share
            </button>
            <button
              onClick={() => onDeleteFile(file._id)}
              className="text-red-500 hover:underline ml-2"
            >
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
};

export default FileTree;
