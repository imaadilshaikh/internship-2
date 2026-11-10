import { NavLink } from 'react-router-dom'
import { BarChart3, CheckCircle2, ChevronRight, LayoutDashboard, ListTodo, Settings2, Sparkles, X } from 'lucide-react'
import { useTaskFlowStore } from '../state/useTaskFlowStore'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/board', label: 'Kanban board', icon: ListTodo },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
]

export function Sidebar() {
  const sidebarOpen = useTaskFlowStore((state) => state.sidebarOpen)
  const setSidebarOpen = useTaskFlowStore((state) => state.setSidebarOpen)
  return <>
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top">
        <div className="brand-mark"><Sparkles size={18} fill="currentColor" /></div>
        <div className="brand-copy"><strong>TaskFlow</strong><span>Workspace OS</span></div>
        <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <div className="workspace-switcher">
        <div className="workspace-avatar">A</div>
        <div><strong>Acme product team</strong><span>Growth workspace</span></div>
        <ChevronRight size={15} />
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="nav-label">Workspace</p>
        {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setSidebarOpen(false)}><Icon size={18} /><span>{label}</span>{label === 'Kanban board' && <span className="nav-count">8</span>}</NavLink>)}
        <p className="nav-label nav-label-spaced">Manage</p>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setSidebarOpen(false)}><Settings2 size={18} /><span>Settings</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><div className="tip-icon"><CheckCircle2 size={16} /></div><div><strong>Focus for today</strong><span>Ship the onboarding flow</span></div></div>
        <div className="sidebar-profile"><div className="profile-avatar">AM</div><div><strong>Alex Morgan</strong><span>Product lead</span></div><button className="icon-button" aria-label="Open profile menu"><ChevronRight size={15} /></button></div>
      </div>
    </aside>
    {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}
  </>
}
