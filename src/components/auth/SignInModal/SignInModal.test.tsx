import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

import SignInModal from './SignInModal';
import * as nextAuth from 'next-auth/react';

describe('SignInModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title', () => {
    render(<SignInModal onClose={onClose} />);
    expect(screen.getByText('Save your itinerary')).toBeInTheDocument();
  });

  it('renders the Google sign-in button', () => {
    render(<SignInModal onClose={onClose} />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('has role dialog with aria-modal', () => {
    render(<SignInModal onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when the close button is clicked', async () => {
    render(<SignInModal onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /close sign-in dialog/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', async () => {
    render(<SignInModal onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls signIn with google when button is clicked', async () => {
    render(<SignInModal onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(nextAuth.signIn).toHaveBeenCalledWith('google');
  });

  it('shows loading state and disables button after clicking sign-in', async () => {
    render(<SignInModal onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(screen.getByText(/redirecting to google/i)).toBeInTheDocument();
    // After click the button text changes — query by its new content
    const buttons = screen.getAllByRole('button');
    const googleButton = buttons.find(button => button.textContent?.includes('Redirecting'));
    expect(googleButton).toBeDisabled();
  });
});
