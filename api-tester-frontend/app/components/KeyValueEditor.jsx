"use client";

export function KeyValueEditor({ darkMode, data, setData }) {
  const dm = darkMode;

  const handleChange = (index, field, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addRow = () => {
    setData((prev) => [...prev, { id: Date.now() + Math.random(), key: "", value: "" }]);
  };

  const removeRow = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  const inputCls = `p-1 border rounded-md text-sm w-full transition ${
    dm
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
  }`;

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={item.id} className="flex gap-2 items-center">
          <input
            value={item.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            placeholder="Key"
            className={`${inputCls} w-5/12`}
          />
          <input
            value={item.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            placeholder="Value"
            className={`${inputCls} w-6/12`}
          />
          <button
            onClick={() => removeRow(index)}
            className="text-red-500 hover:text-red-400 font-bold px-2 transition"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="text-green-500 hover:text-green-400 text-sm font-semibold transition"
      >
        + Add Row
      </button>
    </div>
  );
}
