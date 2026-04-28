import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StepPreferences from './StepPreferences';

describe('StepPreferences', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all interest chips', () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /food & cuisine/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /history & culture/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nature & outdoors/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nightlife/i })).toBeInTheDocument();
  });

  it('adds an interest when clicked', async () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /food & cuisine/i }));
    expect(onChange).toHaveBeenCalledWith({ interests: ['🍜 Food & Cuisine'] });
  });

  it('removes an interest when clicked again', async () => {
    render(<StepPreferences data={{ interests: ['🍜 Food & Cuisine'] }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /food & cuisine/i }));
    expect(onChange).toHaveBeenCalledWith({ interests: [] });
  });

  it('supports selecting multiple interests', async () => {
    render(<StepPreferences data={{ interests: ['🍜 Food & Cuisine'] }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /nature & outdoors/i }));
    expect(onChange).toHaveBeenCalledWith({
      interests: ['🍜 Food & Cuisine', '🌿 Nature & Outdoors'],
    });
  });

  it('marks selected interests as pressed', () => {
    render(<StepPreferences data={{ interests: ['🍜 Food & Cuisine'] }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /food & cuisine/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks unselected interests as not pressed', () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /food & cuisine/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects a budget option', async () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /luxury/i }));
    expect(onChange).toHaveBeenCalledWith({ budget: 'luxury' });
  });

  it('selects a travel pace', async () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /packed/i }));
    expect(onChange).toHaveBeenCalledWith({ pace: 'packed' });
  });

  it('marks selected budget as pressed', () => {
    render(<StepPreferences data={{ interests: [], budget: 'budget' }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /budget/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('updates notes textarea', async () => {
    render(<StepPreferences data={{ interests: [] }} onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'We have a toddler');
    expect(onChange).toHaveBeenCalledWith({ notes: expect.stringContaining('W') });
  });
});
