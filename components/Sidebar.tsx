"use client";

import { JournalEntry, Folder } from "@/lib/types";
import { useState } from "react";

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  selectedId: string | null;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onMoveEntry: (entryId: string, folderId: string | null) => void;
  onSelectFolder: (folderId: string | null) => void;
}

export default function Sidebar({
  entries,
  folders,
  selectedId,
  selectedFolderId,
  onSelect,
  onNew,
  onDelete,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveEntry,
  onSelectFolder,
}: SidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [showMoveMenu, setShowMoveMenu] = useState<string | null>(null);
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = (folderId: string) => {
    if (renameFolderName.trim()) {
      onRenameFolder(folderId, renameFolderName.trim());
      setRenamingFolderId(null);
      setRenameFolderName("");
    }
  };

  const startRenaming = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFolderId(folder.id);
    setRenameFolderName(folder.name);
  };

  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this folder? Entries will be moved to 'All Entries'.")) {
      onDeleteFolder(folderId);
    }
  };

  const filteredEntries = selectedFolderId === null
    ? entries.filter(e => e.folderId === null)
    : entries.filter(e => e.folderId === selectedFolderId);

  const renderEntry = (entry: JournalEntry) => (
    <div
      key={entry.id}
      className={`p-3 cursor-pointer transition-colors relative group ${
        selectedId === entry.id
          ? "bg-blue-50 dark:bg-slate-800"
          : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      onClick={() => onSelect(entry.id)}
    >
      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate pr-16">
        {entry.title || "Untitled"}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {formatDate(entry.updatedAt)}
      </p>
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMoveMenu(showMoveMenu === entry.id ? null : entry.id);
          }}
          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Move entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
          aria-label="Delete entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {showMoveMenu === entry.id && (
        <div className="absolute right-3 top-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 min-w-[150px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveEntry(entry.id, null);
              setShowMoveMenu(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
          >
            All Entries
          </button>
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={(e) => {
                e.stopPropagation();
                onMoveEntry(entry.id, folder.id);
                setShowMoveMenu(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
            >
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Journal
        </h1>
        <button
          onClick={onNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          New Entry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* All Entries Section */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div
            onClick={() => onSelectFolder(null)}
            className={`p-3 cursor-pointer flex items-center gap-2 ${
              selectedFolderId === null
                ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">All Entries</span>
            <span className="ml-auto text-sm text-slate-500">
              {entries.filter(e => e.folderId === null).length}
            </span>
          </div>
        </div>

        {/* Folders Section */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Folders
            </span>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              aria-label="Create folder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {isCreatingFolder && (
            <div className="px-3 pb-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }
                }}
                placeholder="Folder name"
                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {folders.map(folder => {
            const folderEntries = entries.filter(e => e.folderId === folder.id);
            return (
              <div key={folder.id}>
                <div
                  onClick={() => onSelectFolder(folder.id)}
                  className={`p-3 cursor-pointer flex items-center gap-2 group ${
                    selectedFolderId === folder.id
                      ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {renamingFolderId === folder.id ? (
                    <input
                      type="text"
                      value={renameFolderName}
                      onChange={(e) => setRenameFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameFolder(folder.id);
                        if (e.key === "Escape") {
                          setRenamingFolderId(null);
                          setRenameFolderName("");
                        }
                      }}
                      onBlur={() => {
                        setRenamingFolderId(null);
                        setRenameFolderName("");
                      }}
                      className="flex-1 px-2 py-0.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="flex-1 font-medium">{folder.name}</span>
                  )}
                  <span className="text-sm text-slate-500">{folderEntries.length}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={(e) => startRenaming(folder, e)}
                      className="text-slate-400 hover:text-blue-600"
                      aria-label="Rename folder"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteFolder(folder.id, e)}
                      className="text-slate-400 hover:text-red-600"
                      aria-label="Delete folder"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Entries List */}
        <div>
          {filteredEntries.length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
              No entries in this {selectedFolderId ? "folder" : "section"}
            </div>
          ) : (
            <div>
              {filteredEntries.map(renderEntry)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
