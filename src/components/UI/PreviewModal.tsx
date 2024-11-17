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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpreadsheet = async (fileData: number[]) => {
    setLoading(true);
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
    setLoading(true);
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

  useEffect(() => {
    if (
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
    }
  }, [file]);

  const previewContent = useMemo(() => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (file.fileType.startsWith("image/")) {
      const base64Data = btoa(
        new Uint8Array(file.fileData.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return (
        <img
          src={`data:${file.fileType};base64,${base64Data}`}
          alt={file.fileName}
          className="w-full h-auto"
        />
      );
    } else if (file.fileType === "application/pdf") {
      const base64Data = btoa(
        new Uint8Array(file.fileData.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return (
        <iframe
          src={`data:${file.fileType};base64,${base64Data}`}
          className="w-full h-96"
          title={file.fileName}
        />
      );
    } else if (file.fileType === "Video") {
      const base64Data = btoa(
        new Uint8Array(file.fileData.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return (
        <video
          controls
          src={`data:${file.fileType};base64,${base64Data}`}
          className="w-full h-auto"
        />
      );
    } else if (file.fileType === "Spreadsheet" && spreadsheetData) {
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
    } else if (file.fileType === "Document" && docxContent) {
      return <div dangerouslySetInnerHTML={{ __html: docxContent }} />;
    }
    return <p>Preview not available for this file type.</p>;
  }, [loading, error, file, spreadsheetData, docxContent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{file.fileName}</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:underline bg-black"
          >
            Close
          </button>
        </div>
        <div className="overflow-auto max-h-96">{previewContent}</div>
      </div>
    </div>
  );
};

export default PreviewModal;
