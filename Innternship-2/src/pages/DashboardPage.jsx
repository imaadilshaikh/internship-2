import { useMemo, useState } from 'react'
import { ArrowUpRight, CalendarClock, CheckCircle2, ChevronRight, CircleDashed, Clock3, Plus, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { statuses, teamMembers } from '../data/mockData'
import { selectVisibleTasks, useTaskFlowStore } from '../state/useTaskFlowStore'
import { Avatar, AvatarStack, Badge, Button, Card, ProgressBar } from '../components/ui'
import { TaskFilters } from '../components/TaskFilters'
import { TaskModal } from '../components/TaskModal'

const chartTooltipStyle = { borderRadius: 12, border: '1px solid var(--border-subtle)', background: 'var(--surface-elevated)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-soft)' }
const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))
const formatActivityTime = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date))

export function DashboardPage() {
  const projects = useTaskFlowStore((state) => state.projects)
  const tasks = useTaskFlowStore((state) => state.tasks)
  const activities = useTaskFlowStore((state) => state.activities)
  const searchQuery = useTaskFlowStore((state) => state.searchQuery)
  const filters = useTaskFlowStore((state) => state.filters)
  const [selectedTask, setSelectedTask] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const visibleTasks = useMemo(() => selectVisibleTasks({ tasks, searchQuery, filters }), [tasks, searchQuery, filters])
  const completed = tasks.filter((task) => task.status === 'done').length
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length
  const dueSoon = tasks.filter((task) => task.status !== 'done').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3)
  const completionRate = Math.round((completed / tasks.length) * 100)
  const statusData = statuses.map((status) => ({ name: status.label, value: tasks.filter((task) => task.status === status.id).length, color: status.color }))
  const trendData = [{ name: 'Mon', completed: 2, created: 3 }, { name: 'Tue', completed: 4, created: 2 }, { name: 'Wed', completed: 3, created: 4 }, { name: 'Thu', completed: 5, created: 3 }, { name: 'Fri', completed: 6, created: 5 }, { name: 'Sat', completed: 5, created: 2 }, { name: 'Sun', completed: 8, created: 4 }]
  const projectCards = useMemo(() => projects.map((project) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); const finished = projectTasks.filter((task) => task.status === 'done').length; return { ...project, taskCount: projectTasks.length, progress: projectTasks.length ? Math.round((finished / projectTasks.length) * 100) : 0 } }), [projects, tasks])

  return <div className="page-stack">
    <section className="welcome-banner">
      <div className="welcome-copy"><div className="welcome-kicker"><Sparkles size={15} /> Your workspace at a glance</div><h2>Make room for the work that matters.</h2><p>Keep momentum visible, unblock your team, and turn the next idea into progress.</p><div className="welcome-actions"><Button onClick={() => setCreateOpen(true)} icon={Plus}>Create a task</Button><Link className="text-link" to="/board">Open board <ArrowUpRight size={15} /></Link></div></div><div className="welcome-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><CheckCircle2 size={34} /></div><span className="floating-pill floating-pill-top">+24% focus time</span><span className="floating-pill floating-pill-bottom">8 tasks shipped</span></div>
    </section>

    <TaskFilters />

    <section className="stats-grid" aria-label="Workspace summary">
      <Card className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-brand"><ListTodoIcon /></span><span className="trend-positive"><TrendingUp size={14} /> 12.5%</span></div><strong>{tasks.length}</strong><span>Open tasks</span><div className="stat-sparkline sparkline-brand"><i /><i /><i /><i /><i /><i /></div></Card>
      <Card className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-teal"><CheckCircle2 size={18} /></span><span className="trend-positive"><TrendingUp size={14} /> 8.2%</span></div><strong>{completed}</strong><span>Tasks completed</span><div className="stat-sparkline sparkline-teal"><i /><i /><i /><i /><i /><i /></div></Card>
      <Card className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-amber"><Clock3 size={18} /></span><span className="trend-neutral">This week</span></div><strong>{inProgress}</strong><span>In progress</span><div className="stat-progress"><ProgressBar value={Math.round((inProgress / tasks.length) * 100)} /></div></Card>
      <Card className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-rose"><Users size={18} /></span><span className="trend-neutral">Active team</span></div><strong>{teamMembers.length}</strong><span>People collaborating</span><AvatarStack members={teamMembers} /></Card>
    </section>

    <section className="dashboard-grid dashboard-grid-main">
      <Card className="chart-card chart-card-large"><div className="card-heading"><div><p className="section-kicker">Delivery rhythm</p><h2>Weekly throughput</h2></div><Badge tone="teal" dot>On track</Badge></div><div className="chart-legend"><span><i className="legend-dot legend-dot-brand" />Completed</span><span><i className="legend-dot legend-dot-muted" />Created</span><span className="chart-period">Last 7 days <ChevronRight size={14} /></span></div><div className="chart-area chart-area-line"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData} margin={{ top: 14, right: 12, left: -25, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--border-subtle)" strokeDasharray="4 4" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: 'var(--border-subtle)' }} /><Line type="monotone" dataKey="completed" stroke="#3C2A21" strokeWidth={3} dot={{ r: 3, fill: '#3C2A21', strokeWidth: 3, stroke: 'var(--surface-elevated)' }} activeDot={{ r: 5 }} /><Line type="monotone" dataKey="created" stroke="#D5CEA3" strokeWidth={2} strokeDasharray="5 5" dot={false} /></LineChart></ResponsiveContainer></div></Card>
      <Card className="chart-card"><div className="card-heading"><div><p className="section-kicker">Task distribution</p><h2>By status</h2></div><button className="icon-button" aria-label="View status details"><ArrowUpRight size={17} /></button></div><div className="chart-area chart-area-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={4} stroke="none">{statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={chartTooltipStyle} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{completionRate}%</strong><span>complete</span></div></div><div className="status-list">{statusData.map((status) => <div key={status.name}><span><i style={{ backgroundColor: status.color }} />{status.name}</span><strong>{status.value}</strong></div>)}</div></Card>
    </section>

    <section className="dashboard-grid dashboard-grid-bottom">
      <Card className="project-card"><div className="card-heading"><div><p className="section-kicker">Active workstreams</p><h2>Projects</h2></div><Link className="small-link" to="/settings">Manage <ArrowUpRight size={14} /></Link></div><div className="project-list">{projectCards.map((project) => { const owner = teamMembers.find((member) => member.id === project.ownerId); return <div className="project-row" key={project.id}><div className="project-color" style={{ backgroundColor: project.color }} /><div className="project-row-main"><div className="project-title-line"><strong>{project.name}</strong><Badge tone={project.status === 'At risk' ? 'amber' : 'teal'}>{project.status}</Badge></div><div className="project-progress-line"><ProgressBar value={project.progress} label={`${project.progress}%`} /><span>{project.taskCount} tasks</span></div></div><Avatar member={owner} size="sm" /></div> })}</div></Card>
      <Card className="activity-card"><div className="card-heading"><div><p className="section-kicker">Team pulse</p><h2>Recent activity</h2></div><span className="live-indicator"><i /> Live</span></div><div className="activity-list">{activities.slice(0, 4).map((activity) => { const actor = teamMembers.find((member) => member.id === activity.actorId); return <div className="activity-row" key={activity.id}><Avatar member={actor} size="sm" /><div><p><strong>{actor?.name.split(' ')[0]}</strong> {activity.action} <strong>{activity.target}</strong></p><span>{activity.detail} · {formatActivityTime(activity.createdAt)}</span></div></div> })}</div><Link className="activity-footer" to="/insights">View all activity <ArrowUpRight size={15} /></Link></Card>
      <Card className="due-card"><div className="card-heading"><div><p className="section-kicker">Coming up</p><h2>Due next</h2></div><CalendarClock size={18} className="muted-icon" /></div><div className="due-list">{dueSoon.map((task) => { const owner = teamMembers.find((member) => member.id === task.assigneeId); return <button className="due-row" key={task.id} onClick={() => setSelectedTask(task)}><div className="due-date"><strong>{formatDate(task.dueDate).split(' ')[1]}</strong><span>{formatDate(task.dueDate).split(' ')[0]}</span></div><div><strong>{task.title}</strong><span>{owner?.name}</span></div><ChevronRight size={15} /></button> })}</div><Link className="activity-footer" to="/board">See all tasks <ArrowUpRight size={15} /></Link></Card>
    </section>

    {visibleTasks.length === 0 && <div className="filter-empty">No tasks match the current search and filters. Try resetting the filters.</div>}
    <TaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    <TaskModal open={Boolean(selectedTask)} task={selectedTask} onClose={() => setSelectedTask(null)} />
  </div>
}

function ListTodoIcon() { return <CircleDashed size={18} /> }
