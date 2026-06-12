import { X, FolderPlus, Plus } from "lucide-react";

export function CreateCollectionModal({
  darkMode,
  newCollectionName,
  setNewCollectionName,
  saveError,
  setIsCreateModalOpen,
  handleCreateCollection,
  loading,
}) {
  const dm = darkMode;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => setIsCreateModalOpen(false)}
    >
      <div
        className={`p-6 rounded-xl shadow-2xl w-96 border ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-500">New Collection</h3>
          <button onClick={() => setIsCreateModalOpen(false)} className={`transition ${dm ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-800"}`}>
            <X />
          </button>
        </div>

        <input
          value={newCollectionName || ""}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className={`w-full p-2 border rounded-lg mb-4 transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
            dm ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
          placeholder="Collection name"
        />

        {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

        <button
          onClick={handleCreateCollection}
          disabled={loading}
          className={`w-full p-2 rounded-lg font-semibold text-white transition ${
            loading ? "bg-green-700/50 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </div>
    </div>
  );
}

export function SaveRequestModal({
  darkMode,
  collections = [],
  handleSaveRequest,
  setIsSaveModalOpen,
  setIsCreateModalOpen,
  saveError,
  loading,
}) {
  const dm = darkMode;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={() => setIsSaveModalOpen(false)}
    >
      <div
        className={`p-6 rounded-xl shadow-2xl w-96 border ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-500">Save Request</h3>
          <button onClick={() => setIsSaveModalOpen(false)} className={`transition ${dm ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-800"}`}>
            <X />
          </button>
        </div>

        {saveError && <p className="text-red-500 text-sm mb-4">{saveError}</p>}

        {collections.length === 0 && (
          <p className={`text-sm mb-4 ${dm ? "text-gray-400" : "text-gray-500"}`}>No collections yet. Create one below.</p>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar mb-3">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => handleSaveRequest(col.id)}
              disabled={loading}
              className={`w-full text-left p-3 border rounded-lg truncate flex items-center transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              } ${dm ? "border-gray-600 bg-gray-700 text-gray-100 hover:bg-gray-600" : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"}`}
            >
              <FolderPlus className="inline-block w-4 h-4 mr-2 text-green-500 shrink-0" />
              {col.name} ({col.item_count ?? 0})
            </button>
          ))}
        </div>

        <button
          onClick={() => { setIsSaveModalOpen(false); setIsCreateModalOpen(true); }}
          className={`w-full p-2 border rounded-lg flex items-center justify-center transition ${
            dm ? "text-green-400 border-green-700 hover:bg-green-900/30" : "text-green-600 border-green-300 hover:bg-green-50"
          }`}
        >
          <Plus className="w-4 h-4 mr-1" /> New Collection
        </button>
      </div>
    </div>
  );
}
