import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses default label "Loading…"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading…');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Saving itinerary" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Saving itinerary');
  });
});
