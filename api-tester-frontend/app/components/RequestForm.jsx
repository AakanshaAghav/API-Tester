"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { KeyValueEditor } from "./KeyValueEditor";
import { CreateCollectionModal, SaveRequestModal } from "./Modals";
import { getAuthHeaders } from "../lib/supabaseClient";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const methodColor = (m) => {
  if (m === "GET") return "text-green-500";
  if (m === "POST") return "text-blue-400";
  if (m === "DELETE") return "text-red-400";
  if (m === "PUT") return "text-orange-400";
  if (m === "PATCH") return "text-yellow-400";
  return "text-gray-400";
};

export function RequestForm({
  darkMode,
  url, setUrl,
  method, setMethod,
  activeTab, setActiveTab,
  bodyContent, setBodyContent,
  headers, setHeaders,
  params, setParams,
  loading,
  handleSendRequest,
  collections,
  fetchCollections,
}) {
  const dm = darkMode;
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  // Auth state
  const [authType, setAuthType] = useState("none"); // none | bearer | basic
  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");

  const TABS = ["Body", "Headers", "Params", "Auth"];

  const inputCls = `p-1 border rounded-md text-sm w-full transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
    dm ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  const renderAuthContent = () => (
    <div className="space-y-3 p-1">
      <div className="flex gap-2">
        {["none", "bearer", "basic"].map((t) => (
          <button
            key={t}
            onClick={() => setAuthType(t)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              authType === t
                ? "bg-green-600 text-white"
                : dm ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t === "none" ? "No Auth" : t === "bearer" ? "Bearer Token" : "Basic Auth"}
          </button>
        ))}
      </div>

      {authType === "bearer" && (
        <div>
          <label className={`text-xs mb-1 block ${dm ? "text-gray-400" : "text-gray-500"}`}>Token</label>
          <input
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
            placeholder="Enter bearer token..."
            className={inputCls}
          />
          <p className={`text-xs mt-1 ${dm ? "text-gray-500" : "text-gray-400"}`}>
            Will be added as: <span className="font-mono">Authorization: Bearer &lt;token&gt;</span>
          </p>
        </div>
      )}

      {authType === "basic" && (
        <div className="space-y-2">
          <div>
            <label className={`text-xs mb-1 block ${dm ? "text-gray-400" : "text-gray-500"}`}>Username</label>
            <input value={basicUser} onChange={(e) => setBasicUser(e.target.value)} placeholder="Username" className={inputCls} />
          </div>
          <div>
            <label className={`text-xs mb-1 block ${dm ? "text-gray-400" : "text-gray-500"}`}>Password</label>
            <input type="password" value={basicPass} onChange={(e) => setBasicPass(e.target.value)} placeholder="Password" className={inputCls} />
          </div>
          <p className={`text-xs ${dm ? "text-gray-500" : "text-gray-400"}`}>
            Will be added as: <span className="font-mono">Authorization: Basic &lt;base64&gt;</span>
          </p>
        </div>
      )}

      {authType === "none" && (
        <p className={`text-xs italic ${dm ? "text-gray-500" : "text-gray-400"}`}>No authentication will be added to this request.</p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Body":
        return (
          <textarea
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            className={`w-full h-full p-2 border rounded-md font-mono text-xs resize-none transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
              dm ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            } ${method === "GET" || method === "DELETE" || method === "HEAD" ? "opacity-50 cursor-not-allowed" : ""}`}
            placeholder={method === "GET" || method === "DELETE" || method === "HEAD" ? `Body not applicable for ${method}` : "Enter JSON request body..."}
            disabled={method === "GET" || method === "DELETE" || method === "HEAD"}
          />
        );
      case "Headers":
        return <KeyValueEditor darkMode={dm} data={headers} setData={setHeaders} />;
      case "Params":
        return <KeyValueEditor darkMode={dm} data={params} setData={setParams} />;
      case "Auth":
        return renderAuthContent();
      default:
        return null;
    }
  };

  // Inject auth headers before sending
  const handleSend = () => {
    if (authType === "bearer" && bearerToken) {
      const existing = headers.filter((h) => h.key.toLowerCase() !== "authorization");
      setHeaders([...existing, { id: Date.now(), key: "Authorization", value: `Bearer ${bearerToken}` }]);
    } else if (authType === "basic" && basicUser) {
      const encoded = btoa(`${basicUser}:${basicPass}`);
      const existing = headers.filter((h) => h.key.toLowerCase() !== "authorization");
      setHeaders([...existing, { id: Date.now(), key: "Authorization", value: `Basic ${encoded}` }]);
    }
    handleSendRequest();
  };

  return (
    <>
      <section className={`p-4 rounded-xl shadow border min-h-[25%] max-h-[38%] flex flex-col transition-colors ${
        dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <h2 className={`text-base font-bold mb-3 ${dm ? "text-gray-100" : "text-gray-800"}`}>Request</h2>

        {/* URL bar */}
        <div className="flex gap-2 mb-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`p-1 border rounded-lg w-28 font-bold text-sm appearance-none transition focus:outline-none focus:ring-1 focus:ring-green-500 ${methodColor(method)} ${
              dm ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            }`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m} className={dm ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}>{m}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter URL (e.g. http://localhost:3000/api/users)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`flex-grow p-2 border rounded-lg text-sm transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
              dm ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-4 rounded-lg font-semibold text-white transition shadow ${
              loading ? "bg-green-700/50 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 active:bg-green-700"
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Send"}
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            disabled={loading}
            title="Save to Collection"
            className={`px-3 rounded-lg font-semibold text-white transition shadow flex items-center justify-center ${
              loading ? "bg-yellow-700/50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600"
            }`}
          >
            <Save className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex-grow border rounded-lg flex flex-col overflow-hidden ${dm ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
          <div className={`flex gap-4 border-b px-4 py-2 ${dm ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            {TABS.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold pb-1 cursor-pointer text-sm transition ${
                  activeTab === tab
                    ? "text-green-500 border-b-2 border-green-500"
                    : dm ? "text-gray-400 hover:text-green-400" : "text-gray-500 hover:text-green-600"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="p-2 flex-grow overflow-y-auto custom-scrollbar">
            {renderTabContent()}
          </div>
        </div>
      </section>

      {/* Save Modal */}
      {isSaveModalOpen && (
        <SaveRequestModal
          darkMode={dm}
          collections={collections}
          setIsSaveModalOpen={setIsSaveModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          loading={localLoading}
          saveError={null}
          handleSaveRequest={async (collectionId) => {
            try {
              setLocalLoading(true);
              const authHeaders = { ...(await getAuthHeaders()), "Content-Type": "application/json" };
              let parsedBody = null;
              if (bodyContent) {
                try { parsedBody = JSON.parse(bodyContent); }
                catch { alert("Request body is not valid JSON"); return; }
              }
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections/${collectionId}/items`,
                { method: "POST", headers: authHeaders, body: JSON.stringify({ url, method, headers: headers.reduce((a, { key, value }) => { if (key) a[key] = value; return a; }, {}), body: parsedBody }) }
              );
              if (res.ok) { fetchCollections(); setIsSaveModalOpen(false); }
              else { const d = await res.json(); alert(d.message || "Failed to save"); }
            } catch { alert("Error saving request"); }
            finally { setLocalLoading(false); }
          }}
        />
      )}

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <CreateCollectionModal
          darkMode={dm}
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          setIsCreateModalOpen={setIsCreateModalOpen}
          loading={localLoading}
          saveError={null}
          handleCreateCollection={async () => {
            if (!newCollectionName) return;
            try {
              setLocalLoading(true);
              const authHeaders = { ...(await getAuthHeaders()), "Content-Type": "application/json" };
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections`,
                { method: "POST", headers: authHeaders, body: JSON.stringify({ name: newCollectionName }) }
              );
              if (res.ok) { setNewCollectionName(""); setIsCreateModalOpen(false); fetchCollections(); }
              else { const d = await res.json(); alert(d.message || "Failed to create"); }
            } catch { alert("Error creating collection"); }
            finally { setLocalLoading(false); }
          }}
        />
      )}
    </>
  );
}
