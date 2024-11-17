import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";

type File = {
  _id: string;
  fileName: string;
  fileType: string;
  fileData: {
    type: string;
    data: number[];
  };
};

type PreviewModalProps = {
  file: File;
  onClose: () => void;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
  const [spreadsheetData, setSpreadsheetData] = useState<any[][] | null>(null);
  const [docxContent, setDocxContent] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpreadsheet = async (fileData: number[]) => {
    try {
      const arrayBuffer = new Uint8Array(fileData);
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      }) as any[][];
      setSpreadsheetData(parsedData);
    } catch (err) {
      setError("Error processing spreadsheet.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocx = async (fileData: number[]) => {
    try {
      const arrayBuffer = new Uint8Array(fileData);
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
    } catch (err) {
      setError("Error processing DOCX document.");
    } finally {
      setLoading(false);
    }
  };

  const fetchText = (fileData: number[]) => {
    try {
      const decoder = new TextDecoder();
      const text = decoder.decode(new Uint8Array(fileData));
      setTextContent(text);
    } catch (err) {
      setError("Error processing text file.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (file.fileType.startsWith("text/") || file.fileName.endsWith(".txt")) {
      fetchText(file.fileData.data);
    } else if (
      file.fileType.startsWith(
        "application/vnd.openxmlformats-officedocument"
      ) &&
      file.fileName.endsWith(".xlsx")
    ) {
      fetchSpreadsheet(file.fileData.data);
    } else if (
      file.fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fetchDocx(file.fileData.data);
    } else {
      setLoading(false);
    }
  }, [file]);

  const getBase64Data = (fileData: number[]) => {
    return btoa(
      new Uint8Array(fileData).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  const previewContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }
    if (file.fileType.startsWith("image/")) {
      const base64Data = getBase64Data(file.fileData.data);
      return (
        <img
          src={`data:${file.fileType};base64,${base64Data}`}
          alt={file.fileName}
          className="max-w-full max-h-full object-contain"
        />
      );
    } else if (file.fileType === "application/pdf") {
      const base64Data = getBase64Data(file.fileData.data);
      return (
        <iframe
          src={`data:${file.fileType};base64,${base64Data}`}
          className="w-full h-full"
          title={file.fileName}
        />
      );
    } else if (file.fileType.startsWith("video/")) {
      const base64Data = getBase64Data(file.fileData.data);
      return (
        <video
          controls
          src={`data:${file.fileType};base64,${base64Data}`}
          className="max-w-full max-h-full"
        />
      );
    } else if (file.fileType.startsWith("audio/")) {
      const base64Data = getBase64Data(file.fileData.data);
      return (
        <audio
          controls
          src={`data:${file.fileType};base64,${base64Data}`}
          className="w-full"
        />
      );
    } else if (spreadsheetData) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <tbody>
              {spreadsheetData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-gray-100" : ""}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2 text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (docxContent) {
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: docxContent }}
        />
      );
    } else if (textContent) {
      return <pre className="whitespace-pre-wrap text-sm">{textContent}</pre>;
    }
    return (
      <p className="text-center">Preview not available for this file type.</p>
    );
  }, [loading, error, file, spreadsheetData, docxContent, textContent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#171723] rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl max-h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold truncate text-white">
            {file.fileName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4 text-white">
          {previewContent}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
