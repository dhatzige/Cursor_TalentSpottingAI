'use client';

import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  emptyState?: ReactNode;
  pagination?: {
    pageSize: number;
    page: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  onRowClick?: (item: T) => void;
  className?: string;
}

export default function DataGrid<T>({
  data,
  columns,
  keyField,
  emptyState,
  pagination,
  loading = false,
  selectable = false,
  onSelectionChange,
  onRowClick,
  className = ''
}: DataGridProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((row: T) => any) | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    
    const accessor = column.accessor;
    
    setSortConfig(prevConfig => {
      if (prevConfig.key === accessor) {
        return {
          key: accessor,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: accessor, direction: 'asc' };
    });
  };

  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      if (typeof sortConfig.key === 'function') {
        aValue = sortConfig.key(a);
        bValue = sortConfig.key(b);
      } else {
        aValue = a[sortConfig.key as keyof T];
        bValue = b[sortConfig.key as keyof T];
      }
      
      if (aValue === bValue) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (row: T, isSelected: boolean) => {
    const newSelectedRows = isSelected
      ? [...selectedRows, row]
      : selectedRows.filter(r => r[keyField] !== row[keyField]);
    
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedRows = isSelected ? [...data] : [];
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  // Check if row is selected
  const isRowSelected = (row: T) => {
    return selectedRows.some(r => r[keyField] === row[keyField]);
  };

  // Check if all rows are selected
  const areAllRowsSelected = () => {
    return data.length > 0 && selectedRows.length === data.length;
  };

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    const accessor = column.accessor;
    
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    
    return row[accessor];
  };

  // Render cell content
  const renderCell = (row: T, column: Column<T>) => {
    const value = getCellValue(row, column);
    
    if (column.cell) {
      return column.cell(value, row);
    }
    
    return value;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;
    
    const { page, totalItems, pageSize, onPageChange } = pagination;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return (
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalItems)}</span> to{' '}
              <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                aria-label="Previous page"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Only show 5 page numbers centered around current page
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                  return (
                    <Button
                      key={i}
                      onClick={() => onPageChange(pageNum)}
                      variant={pageNum === page ? 'primary' : 'outline'}
                      size="sm"
                      className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={i} className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <Button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                aria-label="Next page"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (emptyState) return emptyState;
    
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
        <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">No data to display</p>
        <p className="text-sm">Try changing your filters or search criteria.</p>
      </div>
    );
  };

  if (loading) {
    return renderLoading();
  }

  if (data.length === 0) {
    return renderEmptyState();
  }

  const sortedData = getSortedData();

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    checked={areAllRowsSelected()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column, idx) => (
                <th 
                  key={idx}
                  scope="col" 
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''} ${column.width ? column.width : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && (
                      <span className="ml-2">
                        {sortConfig.key === column.accessor ? (
                          sortConfig.direction === 'asc' ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )
                        ) : (
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row, rowIdx) => (
              <tr 
                key={String(row[keyField])}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-gray-800' : ''} ${isRowSelected(row) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      checked={isRowSelected(row)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        handleRowSelect(row, e.target.checked);
                      }}
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column, colIdx) => (
                  <td 
                    key={colIdx}
                    className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'} text-sm text-gray-900 dark:text-gray-100 dark:text-gray-200`}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && renderPagination()}
    </div>
  );
}
