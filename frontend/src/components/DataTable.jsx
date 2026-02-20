import { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';

export default function DataTable({ columns, data, onEdit, onDelete, searchField }) {
    const [search, setSearch] = useState('');

    const filtered = searchField
        ? data.filter((row) =>
            String(row[searchField] || '').toLowerCase().includes(search.toLowerCase())
        )
        : data;

    return (
        <div className="glass rounded-2xl overflow-hidden">
            {/* Search bar */}
            {searchField && (
                <div className="p-4 border-b border-gray-800">
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-500 text-sm"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((row, idx) => (
                                <tr
                                    key={row.id || idx}
                                    className="hover:bg-gray-800/30 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-gray-300">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-all"
                                                >
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
