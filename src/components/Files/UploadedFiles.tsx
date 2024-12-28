import React from "react";
import PreviewModal from "../UI/PreviewModal";
import { useFiles } from "../../hooks/useFiles";
import FileControls from "./FileControls";
import FileTree from "./FileTree";

const UploadedFiles: React.FC = () => {
  const {
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
    deleteAllFilesAndFolders,
    navigateUp,
  } = useFiles();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (username: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, username] : prev.filter((u) => u !== username)
    );
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) createFolder(name);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto bg-gray-900 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5">File Explorer</h1>

      <FileControls
        searchTerm={searchTerm}
        usernames={usernames}
        userName={userName}
        selectedUsers={selectedUsers}
        currentFolder={currentFolder}
        onSearch={handleSearch}
        onUserSelect={handleUserSelect}
        onCreateFolder={handleCreateFolder}
        onFileUpload={uploadFile}
        onNavigateUp={navigateUp}
        onDeleteAll={deleteAllFilesAndFolders}
      />

      <FileTree
        data={data}
        parentFolderID={currentFolder}
        onFolderClick={setCurrentFolder}
        onFileClick={setPreviewFile}
        onShareItem={shareItem}
      />

      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default UploadedFiles;
