"use client";

import { ReactNode, useMemo, useState } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

export default function DataTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKeys = [],
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) {
      return data;
    }

    const query = search.toLowerCase();

    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];

        return (
          value != null &&
          value
            .toString()
            .toLowerCase()
            .includes(query)
        );
      })
    );
  }, [search, data, searchKeys]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      {title && (
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}

      <div className="border-b border-slate-800 p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.label}
                  className="px-6 py-4 text-left"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800"
                >
                  {columns.map((column) => (
                    <td
                      key={column.label}
                      className="px-6 py-4"
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            row[column.key as keyof T] ?? ""
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}