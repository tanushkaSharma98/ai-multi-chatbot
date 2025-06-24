export default function ToolSwitcher({ currentTool, onSwitch }) {
  const tools = [
    { key: 'chatbot', label: 'Chatbot' },
    { key: 'summarizer', label: 'Summarizer' },
    { key: 'email', label: 'Email Gen' },
    { key: 'translator', label: 'Translator' },
  ];
  return (
    <div className="flex flex-col space-y-2 items-center">
      <div className="mb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
        {tools.find(t => t.key === currentTool)?.label}
      </div>
      {tools.map((tool) => (
        <button
          key={tool.key}
          className={`px-4 py-2 rounded-full text-sm transition w-28 text-center ${currentTool === tool.key ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          onClick={() => onSwitch(tool.key)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
