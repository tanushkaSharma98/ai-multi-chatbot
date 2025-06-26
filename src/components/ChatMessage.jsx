import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ text, isUser }) {
  return (
    <div className={`max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap ${isUser ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}