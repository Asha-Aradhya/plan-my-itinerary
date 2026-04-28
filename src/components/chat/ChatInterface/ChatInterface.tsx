'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner/Spinner';
import styles from './ChatInterface.module.scss';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const READY_PATTERN = /\[READY\]\s*(\{[\s\S]*?\})\s*\[\/READY\]/;

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm your AI Master — a travel expert here to help you plan the perfect trip.\n\nI can answer questions about any destination (best time to visit, how crowded it gets, what to expect), help you choose where to go, or build a full personalised itinerary through conversation.\n\nWhat's on your mind?",
};

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingPreferences, setPendingPreferences] = useState<object | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);
    setPendingPreferences(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        const displayContent = accumulated.replace(READY_PATTERN, '').trim();
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: displayContent },
        ]);
      }

      const readyMatch = accumulated.match(READY_PATTERN);
      if (readyMatch) {
        try {
          setPendingPreferences(JSON.parse(readyMatch[1]));
        } catch {
          // malformed JSON — ignore
        }
      }

      const cleanContent = accumulated.replace(READY_PATTERN, '').trim();
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: cleanContent },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const handleGenerate = () => {
    if (!pendingPreferences) return;
    setIsNavigating(true);
    sessionStorage.setItem('travelPreferences', JSON.stringify(pendingPreferences));
    router.push('/itinerary');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages} role="log" aria-live="polite" aria-label="Conversation with AI Master">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.row} ${message.role === 'user' ? styles.userRow : styles.aiRow}`}
          >
            {message.role === 'assistant' && (
              <div className={styles.aiAvatar} aria-hidden="true">✦</div>
            )}
            <div className={styles.bubble}>
              {message.content ? (
                message.content.split('\n').map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))
              ) : (
                isStreaming && index === messages.length - 1 && (
                  <Spinner label="AI Master is thinking" />
                )
              )}
            </div>
          </div>
        ))}

        {pendingPreferences && !isStreaming && (
          <div className={styles.generateRow}>
            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={isNavigating}
            >
              {isNavigating
                ? <><Spinner label="Loading itinerary" /> Loading…</>
                : 'Generate My Itinerary ✦'}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about travel…"
          rows={1}
          disabled={isStreaming}
          aria-label="Message"
        />
        <button
          className={styles.sendBtn}
          onClick={send}
          disabled={!input.trim() || isStreaming}
          aria-label="Send message"
        >
          {isStreaming ? <Spinner label="Sending" /> : '↑'}
        </button>
      </div>
    </div>
  );
}
