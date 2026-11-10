import { useMemo, useState } from 'react'
import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CheckCircle2, MoreHorizontal, Plus, SlidersHorizontal } from 'lucide-react'
import { statuses, teamMembers } from '../data/mockData'
import { selectVisibleTasks, useTaskFlowStore } from '../state/useTaskFlowStore'
import { TaskCard } from '../components/TaskCard'
import { TaskFilters } from '../components/TaskFilters'
import { Button, EmptyState } from '../components/ui'
import { TaskModal } from '../components/TaskModal'

function KanbanColumn({ status, tasks, projects, onOpen, onCreate }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id })
  return <section ref={setNodeRef} className={`kanban-column ${isOver ? 'kanban-column-over' : ''}`} aria-labelledby={`${status.id}-heading`}><div className="kanban-column-header"><div><div className="kanban-title"><span className="column-dot" style={{ backgroundColor: status.color }} /><h2 id={`${status.id}-heading`}>{status.label}</h2><span className="column-count">{tasks.length}</span></div><p>{status.id === 'todo' ? 'Ready to start' : status.id === 'done' ? 'Shipped work' : 'Moving forward'}</p></div><button className="icon-button" aria-label={`More ${status.label} options`}><MoreHorizontal size={17} /></button></div><SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}><div className="kanban-task-list">{tasks.map((task) => <TaskCard key={task.id} task={task} project={projects.find((project) => project.id === task.projectId)} onOpen={onOpen} />)}{tasks.length === 0 && <EmptyState icon={CheckCircle2} title="Nothing here yet" description="Drop a task into this column." />}</div></SortableContext><button className="add-column-task" onClick={() => onCreate(status.id)}><Plus size={15} /> Add task</button></section>
}

export function BoardPage() {
  const allTasks = useTaskFlowStore((state) => state.tasks)
  const projects = useTaskFlowStore((state) => state.projects)
  const searchQuery = useTaskFlowStore((state) => state.searchQuery)
  const filters = useTaskFlowStore((state) => state.filters)
  const moveTask = useTaskFlowStore((state) => state.moveTask)
  const reorderTask = useTaskFlowStore((state) => state.reorderTask)
  const [activeId, setActiveId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [createStatus, setCreateStatus] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  const tasks = useMemo(() => selectVisibleTasks({ tasks: allTasks, searchQuery, filters }), [allTasks, searchQuery, filters])
  const activeTask = allTasks.find((task) => task.id === activeId)
  const columns = useMemo(() => statuses.map((status) => ({ ...status, tasks: tasks.filter((task) => task.status === status.id) })), [tasks])
  const handleDragStart = ({ active }) => setActiveId(active.id)
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return
    const overTask = allTasks.find((task) => task.id === over.id)
    const targetStatus = overTask?.status || statuses.find((status) => status.id === over.id)?.id
    const sourceTask = allTasks.find((task) => task.id === active.id)
    if (!sourceTask || !targetStatus) return
    if (sourceTask.status !== targetStatus) moveTask(sourceTask.id, targetStatus)
    else if (overTask) reorderTask(sourceTask.id, overTask.id)
  }
  return <div className="page-stack board-page"><div className="page-toolbar"><div><p className="section-kicker">Plan the next move</p><h2>Move work forward</h2><p className="page-intro">A calm view of everything your team is carrying right now.</p></div><div className="toolbar-actions"><span className="board-member-count"><span className="live-indicator"><i /> Syncing</span>{teamMembers.length} collaborators</span><Button onClick={() => setCreateStatus('todo')} icon={Plus}>New task</Button></div></div><TaskFilters compact /><div className="board-summary"><span><strong>{tasks.length}</strong> visible tasks</span><span><SlidersHorizontal size={14} /> Drag cards between columns to update status</span></div><DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}><div className="kanban-board">{columns.map((column) => <KanbanColumn key={column.id} status={column} tasks={column.tasks} projects={projects} onOpen={setSelectedTask} onCreate={setCreateStatus} />)}</div><DragOverlay dropAnimation={null}>{activeTask ? <TaskCard task={activeTask} project={projects.find((project) => project.id === activeTask.projectId)} onOpen={() => {}} isOverlay /> : null}</DragOverlay></DndContext><TaskModal open={Boolean(selectedTask)} task={selectedTask} onClose={() => setSelectedTask(null)} /><TaskModal open={createStatus !== null} initialStatus={createStatus || 'todo'} onClose={() => setCreateStatus(null)} /></div>
}
