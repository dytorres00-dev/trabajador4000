# 🚀 WorkFlow Dashboard

A premium personal productivity dashboard built with React, Vite, TypeScript, and Tailwind CSS.

## ✨ Features

- **📋 Tareas (Kanban Board)**: Organize tasks across "Pendiente", "En progreso", and "Completado" columns with drag-and-drop functionality.
- **⏱️ Pomodoro Timer**: Focused work sessions with a visual progress indicator, session tracking, and a task selector.
- **💡 Ideas & Contenido**: A creative workspace for capturing and categorizing ideas and content.
- **💾 Local Persistence**: All your data is automatically saved to `localStorage` for zero-setup persistence.
- **🌙 Modern Dark Theme**: A clean, professional aesthetic with an indigo accent color.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Date Formatting**: date-fns

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd workflow-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## 📁 Project Structure

- `src/components/layout`: Main app structure and navigation.
- `src/components/kanban`: Logic and components for the task board.
- `src/components/pomodoro`: Timer logic and visual indicators.
- `src/components/ideas`: Ideas management and grid layout.
- `src/hooks`: Reusable logic (e.g., `useLocalStorage`).
- `src/types`: Application-wide type definitions.

## 📝 Note on Tailwind v4
This project uses Tailwind CSS v4. Unlike v3, configuration is now primarily handled via the Vite plugin (`@tailwindcss/vite`) and the `@import "tailwindcss";` directive in `src/index.css`.
