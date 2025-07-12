import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface TableWithSearchAndFiltersProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterConfig[];
  rowActions?: (row: T) => React.ReactNode;
  pageSize?: number;
}

function TableWithSearchAndFilters<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  filters = [],
  rowActions,
  pageSize = 10,
}: TableWithSearchAndFiltersProps<T>) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  // Filtered and searched data
  const filteredData = useMemo(() => {
    let filtered = data;
    // Apply filters
    filters.forEach(f => {
      const val = filterValues[f.key];
      if (val && val !== 'all') {
        filtered = filtered.filter(row => String(row[f.key]) === val);
      }
    });
    // Apply search
    if (search && searchKeys.length > 0) {
      filtered = filtered.filter(row =>
        searchKeys.some(key => String(row[key] || '').toLowerCase().includes(search.toLowerCase()))
      );
    }
    return filtered;
  }, [data, search, searchKeys, filters, filterValues]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(f => ({ ...f, [key]: value }));
    setPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={handleSearchChange}
          className="w-full md:w-1/2"
        />
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {filters.map(f => (
            <select
              key={f.key}
              value={filterValues[f.key] || 'all'}
              onChange={e => handleFilterChange(f.key, e.target.value)}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="all">{f.label}</option>
              {f.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th key={String(col.key)} className={`py-2 px-3 text-left font-semibold ${col.className || ''}`}>{col.label}</th>
              ))}
              {rowActions && <th className="py-2 px-3 text-left font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr><td colSpan={columns.length + (rowActions ? 1 : 0)} className="text-center py-6 text-gray-400">No data found.</td></tr>
            ) : (
              pagedData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={String(col.key)} className={`py-2 px-3 ${col.className || ''}`}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                  {rowActions && <td className="py-2 px-3">{rowActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&lt;</Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i} variant={page === i + 1 ? 'default' : 'ghost'} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
          ))}
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>&gt;</Button>
        </div>
      )}
    </div>
  );
}

export default TableWithSearchAndFilters; 