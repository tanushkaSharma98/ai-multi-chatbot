export default function ToolSwitcher() {
  return (
    <div className="flex flex-col space-y-2">
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-blue-100 text-sm">
        Summarizer
      </button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-blue-100 text-sm">
        Email Gen
      </button>
      <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-blue-100 text-sm">
        Translator
      </button>
    </div>
  );
}
