import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StepDestination from './StepDestination';

describe('StepDestination', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the destination input', () => {
    render(<StepDestination data={{}} onChange={onChange} />);
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
  });

  it('calls onChange when destination is typed', async () => {
    render(<StepDestination data={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/destination/i), 'T');
    expect(onChange).toHaveBeenCalledWith({ destination: 'T' });
  });

  it('return date input is disabled until departure is set', () => {
    render(<StepDestination data={{}} onChange={onChange} />);
    expect(screen.getByLabelText(/return date/i)).toBeDisabled();
  });

  it('return date input is enabled after departure is set', () => {
    render(<StepDestination data={{ startDate: '2026-08-01' }} onChange={onChange} />);
    expect(screen.getByLabelText(/return date/i)).not.toBeDisabled();
  });

  it('shows hint when no departure date is selected', () => {
    render(<StepDestination data={{}} onChange={onChange} />);
    expect(screen.getByText(/select a departure date first/i)).toBeInTheDocument();
  });

  it('clears return date when departure is moved after it', () => {
    render(<StepDestination data={{ startDate: '2026-08-01', endDate: '2026-08-05' }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2026-08-10' } });
    expect(onChange).toHaveBeenCalledWith({ startDate: '2026-08-10', endDate: '' });
  });

  it('does not clear return date when departure stays before it', () => {
    render(<StepDestination data={{ startDate: '2026-08-05', endDate: '2026-08-10' }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2026-08-01' } });
    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ endDate: '' }));
  });
});
