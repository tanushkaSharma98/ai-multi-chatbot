import Sidebar from '../components/Sidebar';
import ToolSwitcher from '../components/ToolSwitcher';
import ChatArea from '../components/ChatArea';
import InputBox from '../components/InputBox';

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Tool Switcher (top right) */}
        <div className="absolute top-6 right-6 z-10">
          <ToolSwitcher />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-end px-8 pt-8 pb-28 space-y-4 overflow-y-auto">
          <ChatArea />
        </div>

        {/* Input Box */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2/3">
          <InputBox />
        </div>
      </div>
    </div>
  );
}
