"use client";

import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";

interface MarkdownEditorProps {
  title: string;
  content: string;
  color: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onColorChange: (color: string) => void;
  onSave: () => void;
}

export default function MarkdownEditor({
  title,
  content,
  color,
  onTitleChange,
  onContentChange,
  onColorChange,
  onSave,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  const parseMarkdown = (text: string): string => {
    let html = text;

    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, (match) => {
      if (!match.includes("<ul>")) {
        return `<ol>${match}</ol>`;
      }
      return match;
    });

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    html = html.replace(/\n/g, "<br>");

    return html;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Entry title..."
            className="text-3xl font-bold bg-transparent border-none outline-none flex-1 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Color:
          </span>
          <ColorPicker selectedColor={color} onColorChange={onColorChange} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showPreview ? (
          <div
            className="prose prose-slate dark:prose-invert max-w-none p-8"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            style={{
              fontSize: "16px",
              lineHeight: "1.75",
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Start writing your journal entry... (Markdown supported)"
            className="w-full h-full p-8 bg-transparent border-none outline-none resize-none text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono"
            style={{
              fontSize: "16px",
              lineHeight: "1.75",
            }}
          />
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
        Press Cmd/Ctrl + S to save
      </div>
    </div>
  );
}
