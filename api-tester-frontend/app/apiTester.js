"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { RequestForm } from "./components/RequestForm";
import { ResponseViewer } from "./components/ResponseViewer";
import { EnvManager } from "./components/EnvManager";
import { supabase } from "./lib/supabaseClient";
import { Sun, Moon } from "lucide-react";

const initialKeyValue = [{ id: Date.now(), key: "", value: "" }];

const getAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const applyEnvironment = (text, env) => {
  if (!text) return text;
  let result = text;
  Object.entries(env).forEach(([key, val]) => {
    result = result.replaceAll(`{{${key}}}`, val);
  });
  return result;
};

export default function ApiTester() {
  const [userId, setUserId] = useState(null);

  // Theme
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  const [url, setUrl] = useState("{{BASE_URL}}/posts/1");
  const [method, setMethod] = useState("GET");
  const [activeTab, setActiveTab] = useState("Body");
  const [bodyContent, setBodyContent] = useState("");
  const [headers, setHeaders] = useState(initialKeyValue);
  const [params, setParams] = useState(initialKeyValue);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [collectionItems, setCollectionItems] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [activeEnv, setActiveEnv] = useState("dev");
  const [envs, setEnvs] = useState({
    dev: { BASE_URL: "https://jsonplaceholder.typicode.com" },
    staging: {},
    prod: {},
  });

  const loadItemDetails = (item) => {
    if (!item) return;
    setSelectedHistoryId(item.id || null);
    setUrl(item.url || "");
    setMethod(item.method || "GET");

    if (item.request_body) {
      setBodyContent(
        typeof item.request_body === "object"
          ? JSON.stringify(item.request_body, null, 2)
          : item.request_body
      );
    } else {
      setBodyContent("");
    }

    const headersArray =
      item.request_headers && typeof item.request_headers === "object"
        ? Object.entries(item.request_headers).map(([key, value]) => ({
            id: Date.now() + Math.random(),
            key,
            value,
          }))
        : [{ id: Date.now(), key: "", value: "" }];
    setHeaders(headersArray);

    const paramsArray =
      item.request_params && typeof item.request_params === "object"
        ? Object.entries(item.request_params).map(([key, value]) => ({
            id: Date.now() + Math.random(),
            key,
            value,
          }))
        : [{ id: Date.now(), key: "", value: "" }];
    setParams(paramsArray);

    if (item.response_body) {
      setResponse(
        typeof item.response_body === "object"
          ? item.response_body
          : { raw: item.response_body }
      );
    } else {
      setResponse(null);
    }
  };

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/history`, { headers: authHeaders });
    const data = await res.json();
    if (res.ok) setHistoryList(data);
  }, [BACKEND_URL, userId]);

  const fetchCollections = useCallback(async () => {
    if (!userId) return;
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/collections`, { headers: authHeaders });
    const data = await res.json();
    if (res.ok) setCollections(data);
  }, [BACKEND_URL, userId]);

  const fetchCollectionItems = useCallback(
    async (collectionId) => {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/api/collections/${collectionId}/items`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setCollectionItems(res.ok ? data : []);
    },
    [BACKEND_URL]
  );

  const handleSendRequest = useCallback(async () => {
    setLoading(true);
    setResponse(null);

    try {
      const authHeaders = await getAuthHeaders();

      const processedHeaders = headers.reduce(
        (acc, { key, value }) => {
          if (key)
            acc[applyEnvironment(key, envs[activeEnv])] = applyEnvironment(value, envs[activeEnv]);
          return acc;
        },
        { "Content-Type": "application/json" }
      );

      const paramString = params
        .filter((p) => p.key && p.value)
        .map(
          (p) =>
            `${encodeURIComponent(applyEnvironment(p.key, envs[activeEnv]))}=${encodeURIComponent(
              applyEnvironment(p.value, envs[activeEnv])
            )}`
        )
        .join("&");

      const fullUrl = paramString
        ? `${applyEnvironment(url, envs[activeEnv])}?${paramString}`
        : applyEnvironment(url, envs[activeEnv]);

      const bodyPayload =
        method !== "GET" && method !== "DELETE"
          ? JSON.parse(applyEnvironment(bodyContent, envs[activeEnv]) || "{}")
          : null;

      const proxyRes = await fetch(`${BACKEND_URL}/api/proxy`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          url: fullUrl,
          method,
          headers: processedHeaders,
          body: bodyPayload,
        }),
      });

      const proxyData = await proxyRes.json();
      setResponse(proxyData);

      await fetch(`${BACKEND_URL}/api/history`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          url: fullUrl,
          method,
          request_headers: processedHeaders,
          request_body: bodyPayload,
          request_params: params.reduce((acc, p) => {
            if (p.key) acc[p.key] = p.value;
            return acc;
          }, {}),
          response_status: proxyRes.status,
          response_body: proxyData,
        }),
      });

      fetchHistory();
    } catch (err) {
      setResponse({ status: 0, error: "Network error or failed to process request." });
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, params, bodyContent, BACKEND_URL, fetchHistory, activeEnv, envs]);

  useEffect(() => {
    fetchHistory();
    fetchCollections();
  }, [fetchHistory, fetchCollections]);

  const dm = darkMode;

  return (
    <div className={`flex h-screen ${dm ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar
        darkMode={dm}
        historyList={historyList}
        collections={collections}
        collectionItems={collectionItems}
        activeCollectionId={activeCollectionId}
        selectedHistoryId={selectedHistoryId}
        handleCollectionToggle={(id) => {
          setActiveCollectionId(activeCollectionId === id ? null : id);
          fetchCollectionItems(id);
        }}
        loadItemDetails={async (id, type = "history") => {
          try {
            const authHeaders = await getAuthHeaders();
            const endpoint =
              type === "collection"
                ? `${BACKEND_URL}/api/collections/items/${id}`
                : `${BACKEND_URL}/api/history/${id}`;
            const res = await fetch(endpoint, { headers: authHeaders });
            const item = await res.json();
            if (!res.ok) throw new Error(item?.message || "Item not found");
            loadItemDetails(item);
          } catch (err) {
            console.error("Failed to load item detail", err);
          }
        }}
      />

      <main className={`flex-grow flex flex-col p-6 space-y-4 overflow-hidden`}>
        {/* Top bar: EnvManager + Theme toggle */}
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <EnvManager
              darkMode={dm}
              activeEnv={activeEnv}
              setActiveEnv={setActiveEnv}
              envs={envs}
              setEnvs={setEnvs}
            />
          </div>
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className={`mt-1 p-2 rounded-lg border transition duration-150 ${
              dm
                ? "bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {dm ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <RequestForm
          darkMode={dm}
          url={url}
          setUrl={setUrl}
          method={method}
          setMethod={setMethod}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
          headers={headers}
          setHeaders={setHeaders}
          params={params}
          setParams={setParams}
          handleSendRequest={handleSendRequest}
          collections={collections}
          fetchCollections={fetchCollections}
          loading={loading}
        />

        <ResponseViewer darkMode={dm} response={response} />
      </main>
    </div>
  );
}
