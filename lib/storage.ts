import { JournalEntry, DEFAULT_COLOR } from "./types";

const STORAGE_KEY = "journal-entries";

export const storage = {
  getEntries(): JournalEntry[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      const entries = JSON.parse(data);
      // Ensure all entries have a color field (for backwards compatibility)
      return entries.map((entry: JournalEntry) => ({
        ...entry,
        color: entry.color || DEFAULT_COLOR,
      }));
    } catch {
      return [];
    }
  },

  saveEntries(entries: JournalEntry[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  createEntry(title: string, content: string): JournalEntry {
    const entries = this.getEntries();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title,
      content,
      color: DEFAULT_COLOR,
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

  updateEntryColor(id: string, color: string): JournalEntry | null {
    const entries = this.getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    entries[index] = {
      ...entries[index],
      color,
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
    const entry = entries.find((e) => e.id === id);
    if (!entry) return null;
    return {
      ...entry,
      color: entry.color || DEFAULT_COLOR,
    };
  },
};
