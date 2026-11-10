import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useTaskFlowStore } from './state/useTaskFlowStore'

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then((module) => ({ default: module.DashboardPage })))
const BoardPage = lazy(() => import('./pages/BoardPage.jsx').then((module) => ({ default: module.BoardPage })))
const InsightsPage = lazy(() => import('./pages/InsightsPage.jsx').then((module) => ({ default: module.InsightsPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx').then((module) => ({ default: module.SettingsPage })))

function ThemeSync() {
  const theme = useTaskFlowStore((state) => state.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}

function App() {
  return <BrowserRouter><ThemeSync /><Suspense fallback={<div className="route-loading"><div className="route-loading-mark">✦</div><strong>Loading your workspace</strong><span>Getting the next view ready...</span></div>}><Routes><Route element={<AppShell />}><Route path="/" element={<DashboardPage />} /><Route path="/board" element={<BoardPage />} /><Route path="/insights" element={<InsightsPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></Suspense></BrowserRouter>
}

export default App
