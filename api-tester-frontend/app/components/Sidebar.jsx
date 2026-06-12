"use client";
import { ChevronDown, ChevronRight, LogOut, Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const methodColor = (method) => {
  if (method === "GET") return "text-green-500";
  if (method === "POST") return "text-blue-400";
  if (method === "DELETE") return "text-red-400";
  if (method === "PUT") return "text-orange-400";
  return "text-yellow-400";
};

export function Sidebar({
  darkMode,
  collections,
  activeCollectionId,
  collectionItems,
  selectedHistoryId,
  historyList,
  handleCollectionToggle,
  loadItemDetails,
}) {
  const router = useRouter();
  const dm = darkMode;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/");
  };

  return (
    <aside
      className={`w-64 flex flex-col p-4 transition-colors duration-200 border-r shrink-0 ${
        dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-500 flex items-center gap-2">
          <Code className="h-6 w-6" /> Explorer
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <section className="mb-4">
        <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 pb-1 border-b ${dm ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
          Collections
        </h3>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
          {collections.length === 0 && (
            <p className={`text-xs italic ${dm ? "text-gray-500" : "text-gray-400"}`}>No collections yet.</p>
          )}
          {collections.map((col) => {
            const isExpanded = activeCollectionId === col.id;
            return (
              <div key={col.id}>
                <div
                  onClick={() => handleCollectionToggle(col.id)}
                  className={`cursor-pointer p-1 rounded-md flex justify-between items-center transition ${
                    dm ? "text-gray-300 hover:bg-gray-700 hover:text-green-400" : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                    <span className="truncate max-w-[110px]">{col.name}</span>
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${dm ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                    {col.item_count}
                  </span>
                </div>
                {isExpanded && (
                  <div className={`ml-4 border-l pl-2 space-y-1 ${dm ? "border-gray-600" : "border-gray-200"}`}>
                    {collectionItems.length > 0 ? (
                      collectionItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadItemDetails(item.id, "collection")}
                          className={`p-1 rounded-md cursor-pointer transition text-xs flex items-center ${
                            selectedHistoryId === item.id
                              ? dm ? "bg-green-900/40 text-gray-100 border-l-2 border-green-500" : "bg-green-50 text-green-900 border-l-2 border-green-500"
                              : dm ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <span className={`font-mono font-bold w-12 mr-1 ${methodColor(item.method)}`}>{item.method}</span>
                          <span className="truncate">{item.url}</span>
                        </div>
                      ))
                    ) : (
                      <p className={`text-xs py-1 ${dm ? "text-gray-500" : "text-gray-400"}`}>
                        {col.item_count > 0 ? "Loading..." : "Empty folder."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex-grow overflow-y-auto custom-scrollbar pr-1">
        <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 pb-1 border-b ${dm ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
          History (Last 10)
        </h3>
        <div className="text-sm space-y-2">
          {historyList.map((item) => (
            <div
              key={item.id}
              onClick={() => loadItemDetails(item.id, "history")}
              className={`p-2 rounded-md border-l-4 cursor-pointer transition ${
                selectedHistoryId === item.id
                  ? dm ? "bg-green-900/40 border-green-500 text-gray-100" : "bg-green-50 border-green-500 text-green-900"
                  : dm ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className={`font-mono text-xs font-bold ${methodColor(item.method)}`}>{item.method}</span>
              <span className="truncate block text-xs">{item.url}</span>
              <span className={`text-xs block ${dm ? "text-gray-400" : "text-gray-500"}`}>
                {item.response_status || "-"} • {new Date(item.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
