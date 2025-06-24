import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatArea({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} text={msg.text} isUser={msg.isUser} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
