export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color: string;
}

export const ENTRY_COLORS = [
  { name: "red", label: "Red", bg: "bg-red-100", border: "border-red-300", dot: "bg-red-500" },
  { name: "orange", label: "Orange", bg: "bg-orange-100", border: "border-orange-300", dot: "bg-orange-500" },
  { name: "yellow", label: "Yellow", bg: "bg-yellow-100", border: "border-yellow-300", dot: "bg-yellow-500" },
  { name: "green", label: "Green", bg: "bg-green-100", border: "border-green-300", dot: "bg-green-500" },
  { name: "blue", label: "Blue", bg: "bg-blue-100", border: "border-blue-300", dot: "bg-blue-500" },
  { name: "indigo", label: "Indigo", bg: "bg-indigo-100", border: "border-indigo-300", dot: "bg-indigo-500" },
  { name: "purple", label: "Purple", bg: "bg-purple-100", border: "border-purple-300", dot: "bg-purple-500" },
  { name: "gray", label: "Gray", bg: "bg-gray-100", border: "border-gray-300", dot: "bg-gray-500" },
];

export const DEFAULT_COLOR = "blue";
