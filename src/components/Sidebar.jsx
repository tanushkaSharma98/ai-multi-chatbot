export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        + New Chat
      </button>
      <h2 className="text-xs text-gray-500 mb-2">Your conversations</h2>
      <ul className="space-y-2 text-sm">
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Create HTML Game Environment</li>
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Apply to Leave for Emergency</li>
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">What is UI/UX Design?</li>
        <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Create POS System</li>
      </ul>
    </aside>
  );
}
