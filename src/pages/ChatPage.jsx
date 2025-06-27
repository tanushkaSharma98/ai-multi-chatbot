import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ToolSwitcher from '../components/ToolSwitcher';
import ChatArea from '../components/ChatArea';
import InputBox from '../components/InputBox';

const TOOL_OPTIONS = [
  { key: 'chatbot', label: 'Chatbot' },
  { key: 'summarizer', label: 'Summarizer' },
  { key: 'email', label: 'Email Gen' },
  { key: 'translator', label: 'Translator' },
];

const ENDPOINTS = {
  chatbot: '/chatbot',
  summarizer: '/summarize',
  email: '/write-email',
  translator: '/translate',
};

const LANGUAGE_LIST = [
  'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic', 'Portuguese', 'Bengali', 'Other...'
];

// Tool context messages
const TOOL_CONTEXT_MESSAGES = {
  chatbot: 'Ask anything! This is your AI chatbot.',
  summarizer: 'Paste your text and get a concise summary.',
  email: 'Describe your email and get a professional draft.',
  translator: 'Enter text to translate. You will be asked for the target language if not specified.',
};

export default function ChatPage() {
  const [currentTool, setCurrentTool] = useState('chatbot');
  const [chats, setChats] = useState([
    {
      id: 1,
      tool: 'chatbot',
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    },
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [pendingTranslation, setPendingTranslation] = useState(null); // { text: string }
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  // MCP: context state for conversation history
  const [context, setContext] = useState({ history: [] });

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Send message to backend
  const sendMessage = async (input, selectedLanguage) => {
    if (!input.trim()) return;
    const endpoint = ENDPOINTS[currentTool];
    let payload;

    // Translator logic: ask for language if not specified
    if (currentTool === 'translator') {
      let language = selectedLanguage;
      // Try to detect if user specified a language in the input
      const match = input.match(/to ([a-zA-Z]+)/i);
      if (!language && match) {
        language = match[1];
      }
      if (!language) {
        // Ask user for language, but do NOT add user message yet
        setPendingTranslation({ text: input });
        setShowLanguageSelect(true);
        // Don't send to backend yet
        return;
      }
      payload = { text: input, target_language: language };
    } else if (currentTool === 'chatbot') payload = { prompt: input };
    else if (currentTool === 'summarizer') payload = { text: input };
    else if (currentTool === 'email') payload = { description: input };
    else payload = { prompt: input };

    // Always include context in the payload (MCP)
    payload.context = context;

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      let aiText = data.response || data.summary || data.email || data.translation || 'No response.';
      // For translator, add user message and translation together after language is selected
      if (currentTool === 'translator') {
        const newUserMsg = { text: input, isUser: true };
        const newAiMsg = { text: aiText, isUser: false };
        updateActiveChatMessages([...activeChat.messages, newUserMsg, newAiMsg]);
        // Update MCP context
        setContext(prev => ({
          ...prev,
          history: [
            ...prev.history,
            { tool: currentTool, message: input, response: aiText }
          ]
        }));
      } else {
        // For other tools, add user message first, then AI response
        const newUserMsg = { text: input, isUser: true };
        const newAiMsg = { text: aiText, isUser: false };
        updateActiveChatMessages([...activeChat.messages, newUserMsg, newAiMsg]);
        // Update MCP context
        setContext(prev => ({
          ...prev,
          history: [
            ...prev.history,
            { tool: currentTool, message: input, response: aiText }
          ]
        }));
      }
    } catch (err) {
      const errorMsg = { text: 'Error: Could not get response from server.', isUser: false };
      if (currentTool === 'translator') {
        const newUserMsg = { text: input, isUser: true };
        updateActiveChatMessages([...activeChat.messages, newUserMsg, errorMsg]);
        // Update MCP context with error
        setContext(prev => ({
          ...prev,
          history: [
            ...prev.history,
            { tool: currentTool, message: input, response: errorMsg.text }
          ]
        }));
      } else {
        const newUserMsg = { text: input, isUser: true };
        updateActiveChatMessages([...activeChat.messages, newUserMsg, errorMsg]);
        // Update MCP context with error
        setContext(prev => ({
          ...prev,
          history: [
            ...prev.history,
            { tool: currentTool, message: input, response: errorMsg.text }
          ]
        }));
      }
    }
    setShowLanguageSelect(false);
    setPendingTranslation(null);
  };

  // Helper to generate a chat title from messages
  function generateChatTitle(messages) {
    if (!messages || messages.length === 0) return 'New Chat';
    // Use the first user message, or fallback to the first message
    const firstUserMsg = messages.find(m => m.isUser);
    let base = firstUserMsg ? firstUserMsg.text : messages[0].text;
    // Limit to 40 chars, add ellipsis if longer
    return base.length > 40 ? base.slice(0, 40) + '...' : base;
  }

  // Update messages for active chat
  function updateActiveChatMessages(messages) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages, title: generateChatTitle(messages) }
          : c
      )
    );
  }

  // Start a new chat
  function handleNewChat() {
    const newId = Date.now();
    setChats((prev) => [
      { id: newId, tool: currentTool, title: 'New Chat', messages: [], timestamp: Date.now() },
      ...prev,
    ]);
    setActiveChatId(newId);
  }

  // Switch chat
  function handleSelectChat(id) {
    setActiveChatId(id);
  }

  // Switch tool
  function handleToolSwitch(tool) {
    setCurrentTool(tool);
    setShowLanguageSelect(false);
    setPendingTranslation(null);
    // Start a new chat for each tool switch
    const newId = Date.now();
    setChats((prev) => [
      { id: newId, tool, title: 'New Chat', messages: [], timestamp: Date.now() },
      ...prev,
    ]);
    setActiveChatId(newId);
  }

  // Handle language selection for translation
  function handleLanguageSelect(language) {
    if (pendingTranslation) {
      const text = pendingTranslation.text;
      setPendingTranslation(null); // reset it first
      setShowLanguageSelect(false); // hide selector
      sendMessage(text, language); // now send with selected language
    }
  }

  // Delete a single chat
  function handleDeleteChat(id) {
    setChats((prev) => prev.filter((c) => c.id !== id));
    // If the active chat is deleted, switch to the first chat if any
    if (id === activeChatId) {
      setTimeout(() => {
        setChats((current) => {
          if (current.length > 0) setActiveChatId(current[0].id);
          return current;
        });
      }, 0);
    }
  }

  // Clear all chats
  function handleClearAll() {
    setChats([]);
    setActiveChatId(null);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onClearAll={handleClearAll}
      />
      {/* Main Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Tool Switcher (top right) */}
        <div className="absolute top-6 right-6 z-10">
          <ToolSwitcher currentTool={currentTool} onSwitch={handleToolSwitch} />
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-end px-8 pt-8 pb-28 space-y-4 overflow-y-auto">
          <ChatArea messages={activeChat?.messages || []} toolLabel={TOOL_OPTIONS.find(opt => opt.key === currentTool)?.label} />
        </div>
        {/* Input Box or Language Select */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2/3">
          <div className="mb-2 text-center text-gray-500 text-sm font-medium">
            {TOOL_CONTEXT_MESSAGES[currentTool]}
          </div>
          {showLanguageSelect ? (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <div className="mb-2 text-gray-700">Select target language for translation:</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {LANGUAGE_LIST.map(lang => (
                  <button
                    key={lang}
                    className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 text-blue-700"
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <input
                className="border rounded px-2 py-1 mt-2 w-full"
                placeholder="Or type a language..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleLanguageSelect(e.target.value.trim());
                  }
                }}
              />
            </div>
          ) : (
            <InputBox onSend={sendMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
