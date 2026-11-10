import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical, MessageCircle, MoreHorizontal, Paperclip, CheckSquare2 } from 'lucide-react'
import { priorities, teamMembers } from '../data/mockData'
import { Avatar, Badge } from './ui'

const formatDueDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`))

export function TaskCard({ task, project, onOpen, isOverlay = false }) {
  const sortable = useSortable({ id: task.id })
  const style = isOverlay ? undefined : { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }
  const member = teamMembers.find((item) => item.id === task.assigneeId)
  const priority = priorities.find((item) => item.id === task.priority)
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  return <article ref={isOverlay ? undefined : sortable.setNodeRef} style={style} className={`task-card ${sortable.isDragging && !isOverlay ? 'task-card-dragging' : ''} ${isOverlay ? 'task-card-overlay' : ''}`} onClick={() => onOpen(task)}>
    <div className="task-card-top"><Badge tone={priority?.tone}>{priority?.label}</Badge><button className="card-menu" onClick={(event) => event.stopPropagation()} aria-label={`More options for ${task.title}`}><MoreHorizontal size={16} /></button></div>
    <h3>{task.title}</h3>
    <p>{task.description}</p>
    <div className="task-tags">{task.tags.slice(0, 2).map((tag) => <span key={tag}>#{tag}</span>)}</div>
    <div className="task-card-footer"><div className="task-meta"><span><CalendarDays size={14} />{formatDueDate(task.dueDate)}</span>{task.subtasks.length > 0 && <span><CheckSquare2 size={14} />{completedSubtasks}/{task.subtasks.length}</span>}{task.comments.length > 0 && <span><MessageCircle size={14} />{task.comments.length}</span>}</div><Avatar member={member} size="sm" /></div>
    {!isOverlay && <button className="drag-handle" {...sortable.attributes} {...sortable.listeners} onClick={(event) => event.stopPropagation()} aria-label={`Drag ${task.title}`}><GripVertical size={15} /></button>}
    {project && <div className="task-project-line"><span style={{ backgroundColor: project.color }} />{project.name}</div>}
    {task.attachments?.length > 0 && <span className="task-attachment"><Paperclip size={13} />{task.attachments.length}</span>}
  </article>
}
