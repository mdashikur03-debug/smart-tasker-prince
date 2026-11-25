# FocusFlow — Smart Task Management System

A responsive React task manager built with Vite. It stores tasks in the browser using `localStorage`, so tasks remain available after refreshing the page on the same browser.

## Features
- Create, edit, complete, and delete tasks
- Set task descriptions, due dates, categories, and priorities
- Today, Upcoming, All Tasks, and Completed views
- Search tasks and filter by category
- Productivity overview: total, in-progress, completed, and overdue tasks
- Completion progress indicator
- Responsive desktop and mobile layout
- Browser-based persistence with localStorage

## Requirements
- Node.js 18 or newer
- npm

## Run locally
1. Extract the project ZIP.
2. Open the extracted `smart-task-management-system` folder in VS Code.
3. Open the terminal in that folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Production build
```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

## Project structure
```text
smart-task-management-system/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Data storage note
This version uses browser `localStorage`. Data is local to the browser and device; it is not synchronized between devices and does not include user accounts or a cloud database.

## Possible future improvements
- User authentication
- Cloud database (Firebase, Supabase, or MySQL API)
- Calendar month view
- Notifications and reminder scheduling
- Drag-and-drop task ordering
- Recurring tasks and subtasks
