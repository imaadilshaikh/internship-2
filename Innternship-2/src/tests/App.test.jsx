import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { useTaskFlowStore } from '../state/useTaskFlowStore'

const renderApp = () => render(<App />)

beforeEach(() => {
  window.localStorage.clear()
  useTaskFlowStore.setState({ searchQuery: '', filters: { priority: 'all', assigneeId: 'all', projectId: 'all' }, theme: 'light' })
})

afterEach(() => {
  cleanup()
})

describe('TaskFlow application', () => {
  it('renders the overview dashboard and key workspace sections', async () => {
    renderApp()
    expect(await screen.findByText('TaskFlow')).toBeInTheDocument()
    expect(await screen.findByText('Make room for the work that matters.')).toBeInTheDocument()
    expect(await screen.findByText('Weekly throughput')).toBeInTheDocument()
    expect(await screen.findByText('Recent activity')).toBeInTheDocument()
  })

  it('opens the new task modal from the dashboard', async () => {
    renderApp()
    fireEvent.click(await screen.findByRole('button', { name: /create a task/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create a new task')).toBeInTheDocument()
  })

  it('toggles theme and persists the preference', async () => {
    renderApp()
    fireEvent.click(await screen.findByRole('button', { name: /switch to dark mode/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('taskflow-theme')).toBe('dark')
  })
})
