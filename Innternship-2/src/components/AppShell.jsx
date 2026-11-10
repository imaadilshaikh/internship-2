import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { TaskModal } from './TaskModal'

export function AppShell() {
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  return <div className="app-shell"><Sidebar /><div className="main-shell"><Header onCreateTask={() => setTaskModalOpen(true)} /><main className="main-content"><Outlet /></main></div><TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} /></div>
}
