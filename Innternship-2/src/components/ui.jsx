import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'md', icon: Icon, className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`button button-${variant} button-${size} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2} />}
      {children && <span>{children}</span>}
    </button>
  )
}

export function Card({ children, className = '', as: Element = 'section', ...props }) {
  return <Element className={`card ${className}`} {...props}>{children}</Element>
}

export function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return <span className={`badge badge-${tone} ${className}`}>{dot && <span className="badge-dot" />}{children}</span>
}

export function Avatar({ member, size = 'md', className = '' }) {
  if (!member) return <span className={`avatar avatar-${size} avatar-placeholder ${className}`}>?</span>
  return <span className={`avatar avatar-${size} ${className}`} style={{ '--avatar-color': member.color }} title={member.name}>{member.initials}</span>
}

export function AvatarStack({ members = [], max = 4 }) {
  return <div className="avatar-stack" aria-label={`${members.length} team members`}>
    {members.slice(0, max).map((member) => <Avatar key={member.id} member={member} size="sm" />)}
    {members.length > max && <span className="avatar avatar-sm avatar-more">+{members.length - max}</span>}
  </div>
}

export function ProgressBar({ value, tone = 'brand', label }) {
  return <div className="progress-wrap" aria-label={label || `${value}% complete`}>
    <div className="progress-track"><div className={`progress-value progress-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
    {label && <span className="progress-label">{label}</span>}
  </div>
}

export function Modal({ open, onClose, title, description, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-header">
        <div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
      </div>
      {children}
    </div>
  </div>
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return <div className="empty-state">
    {Icon && <div className="empty-icon"><Icon size={22} /></div>}
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
}
