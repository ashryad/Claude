export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}
