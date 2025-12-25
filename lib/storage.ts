import { JournalEntry, Folder } from "./types";

const STORAGE_KEY = "journal-entries";
const FOLDERS_KEY = "journal-folders";

export const storage = {
  getEntries(): JournalEntry[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      const entries = JSON.parse(data);
      // Migration: ensure all entries have folderId field
      return entries.map((entry: any) => ({
        ...entry,
        folderId: entry.folderId ?? null,
      }));
    } catch {
      return [];
    }
  },

  saveEntries(entries: JournalEntry[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  createEntry(title: string, content: string, folderId: string | null = null): JournalEntry {
    const entries = this.getEntries();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title,
      content,
      folderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    entries.unshift(newEntry);
    this.saveEntries(entries);
    return newEntry;
  },

  updateEntry(id: string, title: string, content: string): JournalEntry | null {
    const entries = this.getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    entries[index] = {
      ...entries[index],
      title,
      content,
      updatedAt: Date.now(),
    };
    this.saveEntries(entries);
    return entries[index];
  },

  deleteEntry(id: string): void {
    const entries = this.getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    this.saveEntries(filtered);
  },

  getEntry(id: string): JournalEntry | null {
    const entries = this.getEntries();
    return entries.find((e) => e.id === id) || null;
  },

  moveEntryToFolder(entryId: string, folderId: string | null): void {
    const entries = this.getEntries();
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      entry.folderId = folderId;
      entry.updatedAt = Date.now();
      this.saveEntries(entries);
    }
  },

  // Folder management
  getFolders(): Folder[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(FOLDERS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveFolders(folders: Folder[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  },

  createFolder(name: string): Folder {
    const folders = this.getFolders();
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    folders.push(newFolder);
    this.saveFolders(folders);
    return newFolder;
  },

  updateFolder(id: string, name: string): Folder | null {
    const folders = this.getFolders();
    const index = folders.findIndex((f) => f.id === id);
    if (index === -1) return null;

    folders[index] = {
      ...folders[index],
      name,
    };
    this.saveFolders(folders);
    return folders[index];
  },

  deleteFolder(id: string): void {
    const folders = this.getFolders();
    const filtered = folders.filter((f) => f.id !== id);
    this.saveFolders(filtered);

    // Move entries in this folder to "All Entries"
    const entries = this.getEntries();
    entries.forEach((entry) => {
      if (entry.folderId === id) {
        entry.folderId = null;
      }
    });
    this.saveEntries(entries);
  },

  getFolder(id: string): Folder | null {
    const folders = this.getFolders();
    return folders.find((f) => f.id === id) || null;
  },
};
