import React, { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import useSharedStore from "../store/useSharedStore";
import PreviewModal from "../components/UI/PreviewModal";
import { SharedResource } from "../types";

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

const SharedResources: React.FC = () => {
  const { userID, userName } = useAuthStore();
  const {
    sharedByMe,
    sharedWithMe,
    fetchSharedByMe,
    fetchSharedWithMe,
    removeShare,
  } = useSharedStore();
  const [activeTab, setActiveTab] = useState<"by-me" | "with-me">("with-me");
  const [previewFile, setPreviewFile] = useState<null | File>(null);

  useEffect(() => {
    if (userID) {
      fetchSharedByMe(userID);
      if (userName) {
        fetchSharedWithMe(userName);
      }
    }
  }, [userID]);

  const handlePreview = (resource: SharedResource) => {
    if (resource.resourceType === "File") {
      setPreviewFile({
        _id: resource._id,
        fileName: resource.fileName!,
        fileType: resource.fileType!,
        fileData: resource.fileData!,
        folderID: null,
        sharedWith: [],
      });
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    if (window.confirm("Are you sure you want to remove this share?")) {
      try {
        await removeShare(shareId);
      } catch (error) {
        alert("Error removing share");
      }
    }
  };

  const renderResourceList = (resources: SharedResource[]) => (
    <div className="space-y-4">
      {resources.length === 0 ? (
        <p className="text-gray-400 text-center">No shared resources found</p>
      ) : (
        resources.map((resource) => (
          <div
            key={resource._id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
          >
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() =>
                resource.resourceType === "File" && handlePreview(resource)
              }
            >
              <span className="text-2xl">
                {resource.resourceType === "File" ? "📄" : "📁"}
              </span>
              <div>
                <h3 className="text-lg font-medium">
                  {resource.fileName || resource.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {activeTab === "by-me"
                    ? `Shared with: ${resource.sharedWith || "Unknown"}`
                    : `Shared by: ${resource.sharedBy || "Unknown"}`}
                </p>
                <p className="text-sm text-gray-400">
                  Permission: {resource.permissions}
                </p>
                <p className="text-sm text-gray-400">
                  Shared: {new Date(resource.sharedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {activeTab === "by-me" && (
              <button
                onClick={() => handleRemoveShare(resource._id)}
                className="px-4 py-2 text-sm text-red-400 border border-red-400 rounded hover:bg-red-400 hover:text-white transition-colors"
              >
                Remove Share
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-5 max-w-4xl mx-auto bg-gray-900 shadow-md rounded-lg">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("with-me")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "with-me"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Shared with Me
        </button>
        <button
          onClick={() => setActiveTab("by-me")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "by-me"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Shared by Me
        </button>
      </div>

      {activeTab === "by-me"
        ? renderResourceList(sharedByMe)
        : renderResourceList(sharedWithMe)}

      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default SharedResources;
