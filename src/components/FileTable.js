// import React from "react";

// type File = {
//   id: string;
//   name: string;
//   type: string;
//   size: string;
// };

// type FileTableProps = {
//   files: File[];
//   onFileAction: (action: string, file: File) => void;
// };

// const FileTable: React.FC<FileTableProps> = ({ files, onFileAction }) => {
//   return (
//     <div className="p-6">
//       <table className="min-w-full table-auto text-left">
//         <thead>
//           <tr>
//             <th className="px-6 py-3 text-gray-500 font-medium text-sm">
//               Name
//             </th>
//             <th className="px-6 py-3 text-gray-500 font-medium text-sm">
//               Type
//             </th>
//             <th className="px-6 py-3 text-gray-500 font-medium text-sm">
//               Size
//             </th>
//             <th className="px-6 py-3 text-gray-500 font-medium text-sm">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file) => (
//             <tr key={file.id} className="border-t">
//               <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                 {file.name}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-500">{file.type}</td>
//               <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
//               <td className="px-6 py-4">
//                 <button
//                   onClick={() => onFileAction("preview", file)}
//                   className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
//                 >
//                   Preview
//                 </button>
//                 <button
//                   onClick={() => onFileAction("download", file)}
//                   className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => onFileAction("share", file)}
//                   className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50"
//                 >
//                   Share
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FileTable;
import React from "react";

const FileTable = ({ files, onFileAction }) => {
  return (
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
              <td className="px-6 py-4 text-sm text-gray-500">{file.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onFileAction("preview", file)}
                  className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
                >
                  Preview
                </button>
                <button
                  onClick={() => onFileAction("download", file)}
                  className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-50 mr-2"
                >
                  Download
                </button>
                <button
                  onClick={() => onFileAction("share", file)}
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
  );
};

export default FileTable;
