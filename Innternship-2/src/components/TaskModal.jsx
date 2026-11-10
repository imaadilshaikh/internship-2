import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, MessageCircle, Plus, Trash2 } from 'lucide-react'
import { priorities, statuses, teamMembers } from '../data/mockData'
import { useTaskFlowStore } from '../state/useTaskFlowStore'
import { Avatar, Badge, Button, Modal } from './ui'

const blankTask = (status = 'todo') => ({ title: '', description: '', status, priority: 'medium', assigneeId: 'alex', projectId: 'atlas', dueDate: '2026-11-30', tags: [], subtasks: [], comments: [] })

export function TaskModal({ open, onClose, task, initialStatus = 'todo' }) {
  const projects = useTaskFlowStore((state) => state.projects)
  const addTask = useTaskFlowStore((state) => state.addTask)
  const updateTask = useTaskFlowStore((state) => state.updateTask)
  const deleteTask = useTaskFlowStore((state) => state.deleteTask)
  const toggleSubtask = useTaskFlowStore((state) => state.toggleSubtask)
  const addComment = useTaskFlowStore((state) => state.addComment)
  const [form, setForm] = useState(blankTask(initialStatus))
  const [newSubtask, setNewSubtask] = useState('')
  const [newComment, setNewComment] = useState('')
  const isEditing = Boolean(task)

  useEffect(() => {
    if (open) setForm(task ? { ...task } : blankTask(initialStatus))
  }, [open, task, initialStatus])

  const member = useMemo(() => teamMembers.find((item) => item.id === form.assigneeId), [form.assigneeId])
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    if (isEditing) updateTask(task.id, form)
    else addTask(form)
    onClose()
  }
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    setForm((current) => ({ ...current, subtasks: [...current.subtasks, { id: `sub-${Date.now()}`, title: newSubtask.trim(), completed: false }] }))
    setNewSubtask('')
  }
  const handleComment = (event) => {
    event.preventDefault()
    if (newComment.trim() && task) addComment(task.id, newComment.trim())
    setNewComment('')
  }
  const handleDelete = () => {
    if (task && window.confirm('Delete this task?')) { deleteTask(task.id); onClose() }
  }

  return <Modal open={open} onClose={onClose} wide title={isEditing ? 'Edit task' : 'Create a new task'} description={isEditing ? 'Keep the work clear, current, and easy to action.' : 'Add a focused piece of work to your workspace.'}>
    <form onSubmit={handleSubmit} className="task-modal-layout">
      <div className="task-modal-main">
        <label className="form-label">Task title<input autoFocus value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="e.g. Prepare launch brief" required /></label>
        <label className="form-label">Description<textarea value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="What does good look like for this task?" rows="4" /></label>
        <div className="form-grid">
          <label className="form-label">Status<select value={form.status} onChange={(event) => setField('status', event.target.value)}>{statuses.map((status) => <option value={status.id} key={status.id}>{status.label}</option>)}</select></label>
          <label className="form-label">Priority<select value={form.priority} onChange={(event) => setField('priority', event.target.value)}>{priorities.map((priority) => <option value={priority.id} key={priority.id}>{priority.label}</option>)}</select></label>
          <label className="form-label">Assignee<select value={form.assigneeId} onChange={(event) => setField('assigneeId', event.target.value)}>{teamMembers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
          <label className="form-label">Project<select value={form.projectId} onChange={(event) => setField('projectId', event.target.value)}>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label>
          <label className="form-label form-label-full">Due date<div className="input-with-icon"><CalendarDays size={16} /><input type="date" value={form.dueDate} onChange={(event) => setField('dueDate', event.target.value)} /></div></label>
        </div>
        <div className="form-label"><span>Tags</span><input value={form.tags.join(', ')} onChange={(event) => setField('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} placeholder="design, frontend, launch" /></div>
        <div className="modal-actions"><div>{isEditing && <Button variant="danger" icon={Trash2} onClick={handleDelete}>Delete task</Button>}</div><div className="modal-action-group"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit">{isEditing ? 'Save changes' : 'Create task'}</Button></div></div>
      </div>
      <aside className="task-modal-side">
        <div className="detail-section"><div className="detail-section-heading"><span>Owner</span><Avatar member={member} /><strong>{member?.name}</strong></div></div>
        <div className="detail-section"><div className="detail-section-heading"><span>Subtasks</span><Badge tone="brand">{form.subtasks.filter((item) => item.completed).length}/{form.subtasks.length}</Badge></div><div className="subtask-list">{form.subtasks.map((subtask) => <label className={`subtask-row ${subtask.completed ? 'subtask-complete' : ''}`} key={subtask.id}><button type="button" className="subtask-check" onClick={() => { if (isEditing) toggleSubtask(task.id, subtask.id); setForm((current) => ({ ...current, subtasks: current.subtasks.map((item) => item.id === subtask.id ? { ...item, completed: !item.completed } : item) })) }} aria-label={`Mark ${subtask.title} ${subtask.completed ? 'incomplete' : 'complete'}`}><Check size={13} /></button><span>{subtask.title}</span></label>)}<div className="inline-add"><input value={newSubtask} onChange={(event) => setNewSubtask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleAddSubtask())} placeholder="Add a subtask" /><button type="button" onClick={handleAddSubtask} aria-label="Add subtask"><Plus size={16} /></button></div></div></div>
        {isEditing && <div className="detail-section"><div className="detail-section-heading"><span>Comments</span><MessageCircle size={15} /></div><div className="comments-list">{form.comments.length === 0 && <p className="muted-copy">No comments yet.</p>}{form.comments.map((comment) => { const author = teamMembers.find((item) => item.id === comment.authorId); return <div className="comment-row" key={comment.id}><Avatar member={author} size="sm" /><div><strong>{author?.name}</strong><p>{comment.body}</p></div></div> })}</div><form className="comment-form" onSubmit={handleComment}><input value={newComment} onChange={(event) => setNewComment(event.target.value)} placeholder="Write a comment..." aria-label="Write a comment" /><button type="submit" aria-label="Add comment"><MessageCircle size={15} /></button></form></div>}
      </aside>
    </form>
  </Modal>
}
