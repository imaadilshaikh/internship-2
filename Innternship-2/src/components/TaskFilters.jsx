import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { priorities, teamMembers } from '../data/mockData'
import { useTaskFlowStore } from '../state/useTaskFlowStore'
import { Button } from './ui'

export function TaskFilters({ compact = false }) {
  const filters = useTaskFlowStore((state) => state.filters)
  const projects = useTaskFlowStore((state) => state.projects)
  const setFilter = useTaskFlowStore((state) => state.setFilter)
  const clearFilters = useTaskFlowStore((state) => state.clearFilters)
  const hasFilters = filters.priority !== 'all' || filters.assigneeId !== 'all' || filters.projectId !== 'all'
  return <div className={`filter-bar ${compact ? 'filter-bar-compact' : ''}`}>
    <div className="filter-bar-title"><SlidersHorizontal size={16} /><span>Filter by</span></div>
    <select value={filters.priority} onChange={(event) => setFilter('priority', event.target.value)} aria-label="Filter by priority"><option value="all">All priorities</option>{priorities.map((priority) => <option value={priority.id} key={priority.id}>{priority.label} priority</option>)}</select>
    <select value={filters.assigneeId} onChange={(event) => setFilter('assigneeId', event.target.value)} aria-label="Filter by assignee"><option value="all">All owners</option>{teamMembers.map((member) => <option value={member.id} key={member.id}>{member.name}</option>)}</select>
    {!compact && <select value={filters.projectId} onChange={(event) => setFilter('projectId', event.target.value)} aria-label="Filter by project"><option value="all">All projects</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select>}
    {hasFilters && <Button variant="ghost" size="sm" icon={RotateCcw} onClick={clearFilters}>Reset</Button>}
    {!hasFilters && <span className="filter-hint"><Filter size={14} /> Showing all tasks</span>}
  </div>
}
