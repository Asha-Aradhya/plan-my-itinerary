import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StepTravelers from './StepTravelers';

describe('StepTravelers', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the current traveller count', () => {
    render(<StepTravelers data={{ travelers: 3 }} onChange={onChange} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('increments the traveller count', async () => {
    render(<StepTravelers data={{ travelers: 2 }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith({ travelers: 3 });
  });

  it('decrements the traveller count', async () => {
    render(<StepTravelers data={{ travelers: 3 }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith({ travelers: 2 });
  });

  it('does not go below 1', async () => {
    render(<StepTravelers data={{ travelers: 1 }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith({ travelers: 1 });
  });

  it('does not go above 20', async () => {
    render(<StepTravelers data={{ travelers: 20 }} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith({ travelers: 20 });
  });

  it('selects a trip type', async () => {
    render(<StepTravelers data={{}} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /adventure/i }));
    expect(onChange).toHaveBeenCalledWith({ tripType: 'adventure' });
  });

  it('marks the selected trip type as pressed', () => {
    render(<StepTravelers data={{ tripType: 'romantic' }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /romantic/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks unselected trip types as not pressed', () => {
    render(<StepTravelers data={{ tripType: 'romantic' }} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /adventure/i })).toHaveAttribute('aria-pressed', 'false');
  });
});
