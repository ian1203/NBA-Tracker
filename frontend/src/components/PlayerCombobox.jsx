import React, { useState } from "react";

export default function PlayerCombobox({ items, placeholder, selectedValue, onChange }) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-48">
      <input
        type="text"
        value={selectedValue || search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(""); // clear selection if typing
        }}
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      {search && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white dark:bg-gray-800 border w-full mt-1 max-h-48 overflow-auto rounded shadow">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => {
                onChange(item);
                setSearch("");
              }}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
