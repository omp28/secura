import { create } from "zustand";
import axios from "axios";

interface UploadedFile {
    _id?: string;
    filename: string;
    fileType: string;
    fileData: string;
    fileSize?: number;
}

interface FileStore {
    files: UploadedFile[];
    fetchFiles: (userID: string) => Promise<void>;
    deleteAllFiles: (userID: string) => Promise<void>;
    setFiles: (newFiles: UploadedFile[]) => void;
}

const useFileStore = create<FileStore>((set) => ({
    files: [],

    fetchFiles: async (userID: string) => {
        try {
            const response = await axios.get<UploadedFile[]>(
                `${process.env.REACT_APP_API_URL}/api/files/getfiles/${userID}`
            );
            set({ files: response.data });
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    },

    deleteAllFiles: async (userID: string) => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/files/delete-all/${userID}`
            );
            set({ files: [] });
            alert("All files deleted successfully.");
        } catch (error: any) {
            console.error("Error deleting files:", error);
            alert("Error deleting files: " + error.message);
        }
    },

    setFiles: (newFiles: UploadedFile[]) => set({ files: newFiles }),
}));

export default useFileStore;
