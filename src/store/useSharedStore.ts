import { SharedResource } from "../types";
import { create } from 'zustand';
import axios from 'axios';

interface SharedStore {
  sharedByMe: SharedResource[];
  sharedWithMe: SharedResource[];
  fetchSharedByMe: (userId: string) => Promise<void>;
  fetchSharedWithMe: (userId: string) => Promise<void>;
  removeShare: (shareId: string) => Promise<void>;
}

const useSharedStore = create<SharedStore>((set) => ({
  sharedByMe: [],
  sharedWithMe: [],
  
 fetchSharedByMe: async (userId: string) => {
    try {
      const [filesRes, foldersRes] = await Promise.allSettled([
        axios.get(`${process.env.REACT_APP_API_URL}/api/share/files/shared-by-me?userId=${userId}`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/share/folders/shared-by-me?userId=${userId}`)
      ]);
      
      const filesData = filesRes.status === 'fulfilled' ? filesRes.value.data : [];
      const foldersData = foldersRes.status === 'fulfilled' ? foldersRes.value.data : [];
      
      const sharedResources = [...filesData, ...foldersData].filter(Boolean);
      set({ sharedByMe: sharedResources });
    } catch (error) {
      console.error('Error fetching shared by me resources:', error);
      set({ sharedByMe: [] });
    }
  }, 

fetchSharedWithMe: async (userName: string) => {
  try {
    const [filesRes, foldersRes] = await Promise.allSettled([
      axios.get(`${process.env.REACT_APP_API_URL}/api/share/files/shared-with-me`, {
        params: { userId: userName }  
      }),
      axios.get(`${process.env.REACT_APP_API_URL}/api/share/folders/shared-with-me`, {
        params: { userId: userName }  
      })
    ]);

    console.log('Files Response:', filesRes);
    console.log('Folders Response:', foldersRes);

    const filesData = filesRes.status === 'fulfilled' 
      ? filesRes.value.data.map((file: any) => {
          console.log('Processing file:', file); 
          return {
            ...file,
            resourceType: 'File'
          };
        }) 
      : [];

    const foldersData = foldersRes.status === 'fulfilled'
      ? foldersRes.value.data.map((folder: any) => ({
          ...folder,
          resourceType: 'Folder'
        }))
      : [];

    const sharedResources = [...filesData, ...foldersData].filter(Boolean);
    console.log('Final shared resources:', sharedResources); 
    set({ sharedWithMe: sharedResources });

  } catch (error) {
    console.error('Error fetching shared with me resources:', error);
    set({ sharedWithMe: [] });
  }
},


  removeShare: async (shareId: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/share/${shareId}`);
      set((state) => ({
        sharedByMe: state.sharedByMe.filter(share => share._id !== shareId),
        sharedWithMe: state.sharedWithMe.filter(share => share._id !== shareId)
      }));
    } catch (error) {
      console.error('Error removing share:', error);
      throw error;
    }
  }
}));

export default useSharedStore;