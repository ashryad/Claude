# Journal App

A beautiful, clean, and simple journaling application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Markdown Editor**: Write your journal entries with full markdown support
- **Clean UI**: Beautiful, minimalist interface with dark mode support
- **Local Storage**: All entries are saved locally in your browser
- **Preview Mode**: Toggle between editing and preview modes
- **Quick Save**: Use Cmd/Ctrl + S to quickly save your entries
- **Entry Management**: Create, edit, and delete journal entries
- **Smart Dates**: Shows "Today", "Yesterday", or formatted dates for entries

## Getting Started

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- Click "New Entry" to create a new journal entry
- Click on any entry in the sidebar to view/edit it
- Use markdown syntax in the editor:
  - `# Heading 1`, `## Heading 2`, `### Heading 3`
  - `**bold**`, `*italic*`, `***bold italic***`
  - `[link text](url)`
  - `` `code` ``
  - `* bullet points`
  - `1. numbered lists`
- Click "Preview" to see your formatted markdown
- Click "Save" or press Cmd/Ctrl + S to save changes
- Hover over an entry and click the delete icon to remove it

## Project Structure

```
journal-app/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/
│   ├── MarkdownEditor.tsx # Markdown editor component
│   └── Sidebar.tsx        # Sidebar with entry list
├── lib/
│   ├── storage.ts        # Local storage utilities
│   └── types.ts          # TypeScript types
└── package.json
```

## Technologies

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS v3**: Styling
- **Local Storage**: Data persistence

## License

MIT
