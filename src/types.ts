export interface SharedResource {
  _id: string;
  fileName?: string;  
  name?: string;      
  sharedBy?: string;  
  sharedWith?: string; 
  permissions: 'read' | 'write';
  sharedAt: Date;
  resourceType: 'File' | 'Folder';
  fileType?: string;
  fileData?: {
    type: string;
    data: number[];
  };
  userID?: string;
  folderID?: string | null;
}