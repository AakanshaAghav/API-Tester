"use client";
import { useState, useEffect } from "react";

export function EnvManager({ darkMode, activeEnv, setActiveEnv, envs, setEnvs }) {
  const dm = darkMode;
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("api_envs");
    if (saved) setEnvs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("api_envs", JSON.stringify(envs));
  }, [envs]);

  const addVariable = () => {
    if (!keyName) return;
    setEnvs((prev) => ({
      ...prev,
      [activeEnv]: { ...prev[activeEnv], [keyName]: keyValue },
    }));
    setKeyName("");
    setKeyValue("");
  };

  const deleteVar = (k) => {
    const copy = { ...envs[activeEnv] };
    delete copy[k];
    setEnvs((prev) => ({ ...prev, [activeEnv]: copy }));
  };

  const inputCls = `border px-3 py-1 rounded-lg text-sm transition focus:outline-none focus:ring-1 focus:ring-green-500 ${
    dm
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div className={`px-4 py-2 rounded-xl border shadow-sm space-y-2 shrink-0 transition-colors ${
      dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <h3 className={`text-sm font-bold border-b pb-1 mb-1 ${dm ? "text-gray-100 border-gray-700" : "text-gray-800 border-gray-200"}`}>
        Environments
      </h3>

      {/* Env tabs */}
      <div className="flex gap-2">
        {["dev", "staging", "prod"].map((env) => (
          <button
            key={env}
            onClick={() => setActiveEnv(env)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeEnv === env
                ? "bg-green-600 text-white shadow"
                : dm ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {env.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Add variable */}
      <div className="flex gap-2">
        <input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="KEY" className={`${inputCls} w-1/3`} />
        <input value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder="VALUE" className={`${inputCls} w-1/2`} />
        <button onClick={addVariable} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition">
          Add
        </button>
      </div>

      {/* Variable list */}
      <div className="text-xs space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
        {Object.entries(envs[activeEnv] || {}).map(([k, v]) => (
          <div
            key={k}
            className={`flex justify-between items-center px-3 py-1 rounded-lg border transition ${
              dm ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="font-mono truncate">
              <span className="text-green-500 font-bold">{`{{${k}}}`}</span> → {v}
            </span>
            <button onClick={() => deleteVar(k)} className="text-red-500 hover:text-red-400 font-bold ml-2 transition">✕</button>
          </div>
        ))}
        {Object.keys(envs[activeEnv] || {}).length === 0 && (
          <p className={`text-center py-1 italic ${dm ? "text-gray-500" : "text-gray-400"}`}>
            No variables for {activeEnv.toUpperCase()}.
          </p>
        )}
      </div>
    </div>
  );
}
