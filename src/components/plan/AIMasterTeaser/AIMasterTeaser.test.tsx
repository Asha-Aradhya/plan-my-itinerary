import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: () => mocks.useSession(),
  signIn: (provider: string, options?: object) => mocks.signIn(provider, options),
}));

import AIMasterTeaser from './AIMasterTeaser';

describe('AIMasterTeaser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing while session is loading', () => {
    mocks.useSession.mockReturnValue({ data: null, status: 'loading' });
    const { container } = render(<AIMasterTeaser />);
    expect(container.firstChild).toBeNull();
  });

  it('shows a link to /plan/chat for logged-in users', () => {
    mocks.useSession.mockReturnValue({
      data: { user: { name: 'Asha' } },
      status: 'authenticated',
    });
    render(<AIMasterTeaser />);
    const link = screen.getByRole('link', { name: /chat with our ai master/i });
    expect(link).toHaveAttribute('href', '/plan/chat');
  });

  it('shows the sign-in button for logged-out users', () => {
    mocks.useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<AIMasterTeaser />);
    expect(
      screen.getByRole('button', { name: /sign in to plan with our ai master/i }),
    ).toBeInTheDocument();
  });

  it('calls signIn with /plan/chat callback when sign-in button is clicked', async () => {
    mocks.useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<AIMasterTeaser />);
    await userEvent.click(
      screen.getByRole('button', { name: /sign in to plan with our ai master/i }),
    );
    expect(mocks.signIn).toHaveBeenCalledWith('google', { callbackUrl: '/plan/chat' });
  });

  it('renders the heading and description', () => {
    mocks.useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<AIMasterTeaser />);
    expect(screen.getByRole('heading', { name: /still deciding/i })).toBeInTheDocument();
    expect(screen.getByText(/chat with our ai master — ask about destinations/i)).toBeInTheDocument();
  });
});
