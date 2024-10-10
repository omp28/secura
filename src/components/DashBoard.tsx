import React, { useState, useEffect } from "react";

type File = {
  id: string;
  name: string;
  type: string;
  size: string;
};

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const accessKey = localStorage.getItem("accessKey");

    setFiles([
      {
        id: "1",
        name: "Document1.docx",
        type: "Word Document",
        size: "2.3 MB",
      },
      { id: "2", name: "Image1.jpg", type: "Image", size: "1.5 MB" },
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

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`${action} file with id: ${fileId}`);
  };

  console.log(files);

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
        <div className="p-6">
          <table className="min-w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">
                  Name
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">
                  Type
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">
                  Size
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-t">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {file.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {file.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {file.size}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleFileAction("preview", file.id)}
                      className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleFileAction("download", file.id)}
                      className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleFileAction("share", file.id)}
                      className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
