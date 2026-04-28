import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.pushMock }),
}));

import ChatInterface from './ChatInterface';

function streamResponse(text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

const READY_BLOCK = '[READY]\n{"destination":"Tokyo","startDate":"2026-09-01","endDate":"2026-09-08","travelers":2,"tripType":"cultural","budget":"mid-range","pace":"moderate","interests":["Food & Cuisine"]}\n[/READY]';

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const sessionStore: Record<string, string> = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: vi.fn((key: string, value: string) => { sessionStore[key] = value; }),
        getItem: vi.fn((key: string) => sessionStore[key] ?? null),
        removeItem: vi.fn((key: string) => { delete sessionStore[key]; }),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders the AI Master welcome message', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/I'm your AI Master/i)).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    render(<ChatInterface />);
    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Hi');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('displays the user message after sending', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse('Hello!'));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'What is best in Tokyo?');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('What is best in Tokyo?')).toBeInTheDocument();
    });
  });

  it('streams the assistant response into the conversation', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse('Tokyo is amazing in autumn.'));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Tell me about Tokyo');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Tokyo is amazing in autumn.')).toBeInTheDocument();
    });
  });

  it('shows the Generate button when [READY] block is detected', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse(`Great! Generating now. ${READY_BLOCK}`));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Yes go ahead');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate my itinerary/i })).toBeInTheDocument();
    });
  });

  it('hides the [READY] block from the visible conversation', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse(`All set. ${READY_BLOCK}`));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Yes');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate my itinerary/i })).toBeInTheDocument();
    });

    expect(screen.queryByText(/\[READY\]/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\[\/READY\]/)).not.toBeInTheDocument();
  });

  it('stores preferences and navigates when Generate is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse(`Done! ${READY_BLOCK}`));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Yes');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    const generateBtn = await screen.findByRole('button', { name: /generate my itinerary/i });
    await userEvent.click(generateBtn);

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'travelPreferences',
      expect.stringContaining('Tokyo'),
    );
    expect(mocks.pushMock).toHaveBeenCalledWith('/itinerary');
  });

  it('shows an error message when the API fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network'));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Hi');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('sends the user message via Enter key', async () => {
    global.fetch = vi.fn().mockResolvedValue(streamResponse('Hello'));
    render(<ChatInterface />);

    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Hi{Enter}');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
