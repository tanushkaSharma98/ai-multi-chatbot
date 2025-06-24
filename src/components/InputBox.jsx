export default function InputBox() {
  return (
    <div className="bg-white rounded-lg shadow flex items-center px-4 py-2">
      <input
        className="flex-1 border-none outline-none bg-transparent text-gray-700 text-lg"
        type="text"
        placeholder="What's in your mind..."
      />
      <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Send
      </button>
    </div>
  );
}
