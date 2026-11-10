# Source structure

- `components/` — app shell, sidebar, header, task cards, filters, modal, and reusable UI atoms.
- `pages/` — routed Overview, Kanban Board, Insights, and Settings screens.
- `state/` — Zustand store for projects, tasks, filters, theme, comments, subtasks, and activity.
- `data/` — mock projects, tasks, team members, statuses, priorities, and activity feed.
- `styles/` — Tailwind entrypoint plus CSS-variable light/dark design tokens and responsive styles.
- `tests/` — Vitest and React Testing Library setup and smoke coverage.

All product state is mock-data based and intentionally backend-ready.
