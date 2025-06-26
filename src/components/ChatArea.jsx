import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatArea({ messages, toolLabel }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto">
      <div className="text-2xl font-bold text-center text-blue-700 mb-2">{toolLabel}</div>
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} text={msg.text} isUser={msg.isUser} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
