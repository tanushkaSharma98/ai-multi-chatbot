export default function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onClearAll }) {
  const TOOL_LABELS = {
    chatbot: 'Chatbot',
    summarizer: 'Summarizer',
    email: 'Email Gen',
    translator: 'Translator',
  };
  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={onNewChat}>
          + New Chat
        </button>
        <button
          className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
          onClick={onClearAll}
          title="Clear All Chats"
        >
          Clear All
        </button>
      </div>
      <h2 className="text-xs text-gray-500 mb-2">Your conversations</h2>
      <ul className="space-y-2 text-sm">
        {chats.map(chat => (
          <li
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${chat.id === activeChatId ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
          >
            <span onClick={() => onSelectChat(chat.id)} className="flex-1 truncate">
              <span className="font-bold text-blue-700 mr-1">[{TOOL_LABELS[chat.tool] || 'Chat'}]</span> {chat.title}
            </span>
            <button
              className="ml-2 text-gray-400 hover:text-red-500"
              title="Delete Chat"
              onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
