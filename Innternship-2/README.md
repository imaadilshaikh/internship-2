# TaskFlow

TaskFlow is a responsive project management dashboard built with React 18, Vite, Tailwind CSS, React Router, Zustand, Recharts, dnd-kit, Lucide React, Vitest, and React Testing Library.

## What is included

The full dashboard now includes a responsive application shell with sidebar navigation, header search, theme toggle, overview dashboard, KPI cards, project progress, activity feed, Recharts visualizations, a drag-and-drop Kanban board, global search and filters, task create/edit/delete modal flows, subtasks, comments, insights analytics, and settings for profile, workspace defaults, and light/dark appearance.

The project uses local mock data in `src/data/mockData.js` and Zustand in `src/state/useTaskFlowStore.js`, so it works without a backend while keeping the data layer easy to replace with an API later.

## Run locally

```bash
pnpm install
pnpm dev
```

The managed development server listens on port `3000`. Build and test with:

```bash
pnpm run build
pnpm test
```

## Structure

- `src/components/` — shell, navigation, task cards, modal, filters, and reusable UI atoms.
- `src/pages/` — Overview, Kanban Board, Insights, and Settings routes.
- `src/state/` — Zustand store for tasks, projects, filters, theme, and activity.
- `src/data/` — mock project, task, team, and activity data.
- `src/styles/` — Tailwind entrypoint and CSS-variable design tokens.
- `src/tests/` — Vitest and React Testing Library setup/tests.
