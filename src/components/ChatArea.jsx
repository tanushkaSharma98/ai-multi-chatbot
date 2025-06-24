import ChatMessage from './ChatMessage';

export default function ChatArea() {
  return (
    <div className="flex flex-col space-y-4">
      <ChatMessage text="Hello! How can I help you?" isUser={false} />
      <ChatMessage text="Hi! I need a summary of this text..." isUser={true} />
    </div>
  );
}
