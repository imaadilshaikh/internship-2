import { Bell, Menu, Moon, Plus, Search, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from './ui'
import { useTaskFlowStore } from '../state/useTaskFlowStore'

const pageMeta = {
  '/': { eyebrow: 'Tuesday, November 10, 2026', title: 'Good morning, Alex' },
  '/board': { eyebrow: 'Workspace / Planning', title: 'Kanban board' },
  '/insights': { eyebrow: 'Workspace / Performance', title: 'Insights' },
  '/settings': { eyebrow: 'Workspace / Preferences', title: 'Settings' },
}

export function Header({ onCreateTask }) {
  const location = useLocation()
  const setSidebarOpen = useTaskFlowStore((state) => state.setSidebarOpen)
  const theme = useTaskFlowStore((state) => state.theme)
  const toggleTheme = useTaskFlowStore((state) => state.toggleTheme)
  const searchQuery = useTaskFlowStore((state) => state.searchQuery)
  const setSearchQuery = useTaskFlowStore((state) => state.setSearchQuery)
  const meta = pageMeta[location.pathname] || pageMeta['/']
  return <header className="topbar">
    <div className="topbar-heading"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div><p>{meta.eyebrow}</p><h1>{meta.title}</h1></div></div>
    <div className="topbar-actions">
      <label className="search-field"><Search size={17} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search tasks, projects..." aria-label="Search tasks and projects" /><kbd>⌘ K</kbd></label>
      <button className="icon-button notification-button" aria-label="View notifications"><Bell size={18} /><span /></button>
      <button className="icon-button theme-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
      <Button onClick={onCreateTask} icon={Plus} className="topbar-create"><span>New task</span></Button>
    </div>
  </header>
}
