import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";

type File = {
  id: string;
  name: string;
  type: string;
  size: any;
};

type PreviewModalProps = {
  file: File;
  onClose: () => void;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
  const [spreadsheetData, setSpreadsheetData] = useState<any[][] | null>(null);
  const [docxContent, setDocxContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fetch spreadsheet data
  const fetchSpreadsheet = async (fileName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/${fileName}`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      }) as any[][];
      setSpreadsheetData(parsedData);
    } catch (err) {
      setError("Error fetching spreadsheet.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch DOCX data
  const fetchDocx = async (fileName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/${fileName}`);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
    } catch (err) {
      setError("Error fetching DOCX document.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch based on file type
  useEffect(() => {
    if (file.type === "Spreadsheet") {
      fetchSpreadsheet(file.name);
    } else if (file.type === "Document") {
      fetchDocx(file.name);
    }
  }, [file]);

  // Memoized preview content
  const previewContent = useMemo(() => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (file.type === "Image") {
      return (
        <img
          src={`/${file.name}`}
          alt={file.name}
          className="max-w-full max-h-full"
        />
      );
    } else if (file.type === "PDF") {
      return (
        <iframe
          src={`/${file.name}`}
          className="w-full h-full"
          title="PDF Preview"
        />
      );
    } else if (file.type === "Video") {
      return <video controls src={`/${file.name}`} className="w-full h-full" />;
    } else if (file.type === "Spreadsheet" && spreadsheetData) {
      return (
        <table className="table-auto w-full">
          <tbody>
            {spreadsheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (file.type === "Document" && docxContent) {
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: docxContent }}
        ></div>
      );
    } else {
      return <p>Preview not available for this file type. Download to view.</p>;
    }
  }, [file, spreadsheetData, docxContent, loading, error]);

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg h-[80vh] w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Preview: {file.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        <div className="py-4 h-full overflow-auto">{previewContent}</div>
      </div>
    </div>
  );
};

export default PreviewModal;
