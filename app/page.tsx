"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MarkdownEditor from "@/components/MarkdownEditor";
import { JournalEntry, DEFAULT_COLOR } from "@/lib/types";
import { storage } from "@/lib/storage";

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [isNewEntry, setIsNewEntry] = useState(false);

  useEffect(() => {
    const loadedEntries = storage.getEntries();
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) {
      setSelectedId(loadedEntries[0].id);
      setTitle(loadedEntries[0].title);
      setContent(loadedEntries[0].content);
      setColor(loadedEntries[0].color);
    }
  }, []);

  const handleSelectEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setSelectedId(id);
      setTitle(entry.title);
      setContent(entry.content);
      setColor(entry.color);
      setIsNewEntry(false);
    }
  };

  const handleNewEntry = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setColor(DEFAULT_COLOR);
    setIsNewEntry(true);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (selectedId) {
      storage.updateEntryColor(selectedId, newColor);
      const updatedEntries = storage.getEntries();
      setEntries(updatedEntries);
    }
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    if (isNewEntry || !selectedId) {
      const newEntry = storage.createEntry(title, content);
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
        selectedId={selectedId}
        onSelect={handleSelectEntry}
        onNew={handleNewEntry}
        onDelete={handleDelete}
      />
      <MarkdownEditor
        title={title}
        content={content}
        color={color}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onColorChange={handleColorChange}
        onSave={handleSave}
      />
    </div>
  );
}
