import React from "react";

interface FileControlsProps {
  searchTerm: string;
  usernames: string[];
  userName: string | null;
  selectedUsers: string[];
  currentFolder: string | null;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserSelect: (username: string, checked: boolean) => void;
  onCreateFolder: () => void;
  onFileUpload: (files: FileList) => void;
  onNavigateUp: () => void;
  onDeleteAll: () => void;
}

const FileControls: React.FC<FileControlsProps> = ({
  searchTerm,
  usernames,
  userName,
  selectedUsers,
  currentFolder,
  onSearch,
  onUserSelect,
  onCreateFolder,
  onFileUpload,
  onNavigateUp,
  onDeleteAll,
}) => {
  return (
    <>
      <div className="flex items-center space-x-4 mb-5">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={onSearch}
          className="p-2 border rounded w-full bg-gray-900"
        />
        <div className="w-full max-h-32 overflow-auto border p-2 rounded">
          {usernames
            .filter((username) =>
              username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((username) => username !== userName)
            .map((username) => (
              <label key={username} className="block">
                <input
                  type="checkbox"
                  value={username}
                  checked={selectedUsers.includes(username)}
                  onChange={(e) => onUserSelect(username, e.target.checked)}
                  className="mr-2"
                />
                {username}
              </label>
            ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-5">
        <button
          onClick={onCreateFolder}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          New Folder
        </button>
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && onFileUpload(e.target.files)}
          className="file-input"
        />
        {currentFolder && (
          <button
            onClick={onNavigateUp}
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
          >
            Go Back
          </button>
        )}
        <button
          onClick={onDeleteAll}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete All Files and Folders
        </button>
      </div>
    </>
  );
};

export default FileControls;
