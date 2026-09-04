import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Page from './+page.svelte'
import '@testing-library/jest-dom/vitest'

describe('/+page.svelte', () => {
  it('should render h1', () => {
    render(Page)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
