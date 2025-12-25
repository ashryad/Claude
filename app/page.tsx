"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MarkdownEditor from "@/components/MarkdownEditor";
import { JournalEntry, Folder } from "@/lib/types";
import { storage } from "@/lib/storage";

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNewEntry, setIsNewEntry] = useState(false);

  useEffect(() => {
    const loadedEntries = storage.getEntries();
    const loadedFolders = storage.getFolders();
    setEntries(loadedEntries);
    setFolders(loadedFolders);

    // Select first entry in "All Entries" if available
    const allEntriesItems = loadedEntries.filter(e => e.folderId === null);
    if (allEntriesItems.length > 0) {
      setSelectedId(allEntriesItems[0].id);
      setTitle(allEntriesItems[0].title);
      setContent(allEntriesItems[0].content);
      setSelectedFolderId(null);
    } else if (loadedEntries.length > 0) {
      setSelectedId(loadedEntries[0].id);
      setTitle(loadedEntries[0].title);
      setContent(loadedEntries[0].content);
      setSelectedFolderId(loadedEntries[0].folderId);
    }
  }, []);

  const handleSelectEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setSelectedId(id);
      setTitle(entry.title);
      setContent(entry.content);
      setIsNewEntry(false);
    }
  };

  const handleNewEntry = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setIsNewEntry(true);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    if (isNewEntry || !selectedId) {
      const newEntry = storage.createEntry(title, content, selectedFolderId);
      const updatedEntries = storage.getEntries();
      setEntries(updatedEntries);
      setSelectedId(newEntry.id);
      setIsNewEntry(false);
    } else {
      storage.updateEntry(selectedId, title, content);
      const updatedEntries = storage.getEntries();
      setEntries(updatedEntries);
    }
  };

  const handleCreateFolder = (name: string) => {
    storage.createFolder(name);
    const updatedFolders = storage.getFolders();
    setFolders(updatedFolders);
  };

  const handleDeleteFolder = (id: string) => {
    storage.deleteFolder(id);
    const updatedFolders = storage.getFolders();
    const updatedEntries = storage.getEntries();
    setFolders(updatedFolders);
    setEntries(updatedEntries);
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
  };

  const handleRenameFolder = (id: string, name: string) => {
    storage.updateFolder(id, name);
    const updatedFolders = storage.getFolders();
    setFolders(updatedFolders);
  };

  const handleMoveEntry = (entryId: string, folderId: string | null) => {
    storage.moveEntryToFolder(entryId, folderId);
    const updatedEntries = storage.getEntries();
    setEntries(updatedEntries);
  };

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    const filteredEntries = folderId === null
      ? entries.filter(e => e.folderId === null)
      : entries.filter(e => e.folderId === folderId);

    if (filteredEntries.length > 0) {
      setSelectedId(filteredEntries[0].id);
      setTitle(filteredEntries[0].title);
      setContent(filteredEntries[0].content);
      setIsNewEntry(false);
    } else {
      setSelectedId(null);
      setTitle("");
      setContent("");
      setIsNewEntry(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      storage.deleteEntry(id);
      const updatedEntries = storage.getEntries();
      setEntries(updatedEntries);

      if (selectedId === id) {
        if (updatedEntries.length > 0) {
          setSelectedId(updatedEntries[0].id);
          setTitle(updatedEntries[0].title);
          setContent(updatedEntries[0].content);
        } else {
          setSelectedId(null);
          setTitle("");
          setContent("");
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        entries={entries}
        folders={folders}
        selectedId={selectedId}
        selectedFolderId={selectedFolderId}
        onSelect={handleSelectEntry}
        onNew={handleNewEntry}
        onDelete={handleDelete}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onMoveEntry={handleMoveEntry}
        onSelectFolder={handleSelectFolder}
      />
      <MarkdownEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSave={handleSave}
      />
    </div>
  );
}
