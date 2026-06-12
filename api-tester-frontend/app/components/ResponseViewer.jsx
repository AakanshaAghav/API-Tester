"use client";
import { useState } from "react";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { Copy, Check } from "lucide-react";

export function ResponseViewer({ darkMode, response }) {
  const dm = darkMode;
  const [activeTab, setActiveTab] = useState("Body");
  const [viewMode, setViewMode] = useState("pretty"); // pretty | raw
  const [copied, setCopied] = useState(false);

  const statusColor = () => {
    if (!response) return "";
    if (response.status === 0 || response.status >= 500) return dm ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600";
    if (response.status >= 400) return dm ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600";
    if (response.status >= 300) return dm ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-600";
    return dm ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600";
  };

  const copyToClipboard = () => {
    if (!response) return;
    const text = typeof response.body === "object"
      ? JSON.stringify(response.body, null, 2)
      : String(response.body || response.error || "");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderBody = () => {
    if (!response) return null;
    const body = response.body || (response.error ? { error: response.error } : null);
    if (!body) return <p className={`text-sm ${dm ? "text-gray-400" : "text-gray-500"}`}>Empty response body.</p>;

    if (viewMode === "raw") {
      return (
        <pre className={`text-xs font-mono whitespace-pre-wrap break-all ${dm ? "text-gray-300" : "text-gray-700"}`}>
          {typeof body === "object" ? JSON.stringify(body, null, 2) : String(body)}
        </pre>
      );
    }

    if (typeof body === "object") {
      return (
        <JsonView
          value={body}
          style={dm ? darkTheme : lightTheme}
          collapsed={2}
          enableClipboard={false}
          displayDataTypes={false}
        />
      );
    }

    return (
      <pre className={`text-xs font-mono whitespace-pre-wrap break-all ${dm ? "text-gray-300" : "text-gray-700"}`}>
        {String(body)}
      </pre>
    );
  };

  const renderHeaders = () => {
    if (!response?.headers) return <p className={`text-sm ${dm ? "text-gray-400" : "text-gray-500"}`}>No headers.</p>;
    return (
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className={`border-b ${dm ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
            <th className="text-left py-1 pr-4 w-1/3">Header</th>
            <th className="text-left py-1">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(response.headers).map(([k, v]) => (
            <tr key={k} className={`border-b ${dm ? "border-gray-800 text-gray-300" : "border-gray-100 text-gray-700"}`}>
              <td className="py-1 pr-4 text-green-500 font-semibold">{k}</td>
              <td className="py-1 break-all">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section className={`flex-1 p-4 rounded-xl shadow border overflow-hidden flex flex-col transition-colors ${
      dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 shrink-0 flex-wrap gap-2">
        <h2 className="text-base font-bold text-green-500">Response</h2>

        <div className="flex items-center gap-2 flex-wrap">
          {response && (
            <>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor()}`}>
                {response.status} {response.statusText}
              </span>
              {response.duration && (
                <span className={`px-2 py-1 rounded text-xs ${dm ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  {response.duration}
                </span>
              )}
              {response.headers?.["content-length"] && (
                <span className={`px-2 py-1 rounded text-xs ${dm ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  {response.headers["content-length"]} B
                </span>
              )}
              <button
                onClick={copyToClipboard}
                title="Copy response"
                className={`p-1 rounded transition ${dm ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-800"}`}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {response ? (
        <>
          {/* Tabs */}
          <div className={`flex gap-4 border-b mb-3 shrink-0 ${dm ? "border-gray-700" : "border-gray-200"}`}>
            {["Body", "Headers"].map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-1 cursor-pointer transition ${
                  activeTab === tab
                    ? "text-green-500 border-b-2 border-green-500"
                    : dm ? "text-gray-400 hover:text-green-400" : "text-gray-500 hover:text-green-600"
                }`}
              >
                {tab}
              </span>
            ))}

            {activeTab === "Body" && (
              <div className="ml-auto flex gap-1">
                {["pretty", "raw"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`text-xs px-2 py-0.5 rounded transition ${
                      viewMode === mode
                        ? "bg-green-600 text-white"
                        : dm ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex-1 rounded-lg p-3 overflow-auto border custom-scrollbar ${dm ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
            {activeTab === "Body" ? renderBody() : renderHeaders()}
          </div>
        </>
      ) : (
        <div className={`flex-1 flex items-center justify-center text-sm border border-dashed rounded-lg ${
          dm ? "text-gray-500 border-gray-700" : "text-gray-400 border-gray-300"
        }`}>
          Hit <span className="mx-1 font-bold text-green-500">Send</span> to get a response
        </div>
      )}
    </section>
  );
}
