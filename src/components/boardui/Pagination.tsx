import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official BoardUI Pagination Bar Component
 * Figma source: Board UI -> Tables -> Pagination
 * Displays tabular item counts, row density select, and accessible numeric page pills.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className = '',
  style = {},
}) => {
  const startItem = totalItems ? Math.min((currentPage - 1) * pageSize + 1, totalItems) : null;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={`boardui-pagination ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '12px 16px',
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle, #e2e8f0)',
        fontSize: 12.5,
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Left: Item Range Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary, #475569)' }}>
        {totalItems !== undefined ? (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            Showing <strong style={{ color: '#0f172a' }}>{startItem}–{endItem}</strong> of{' '}
            <strong style={{ color: '#0f172a' }}>{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of{' '}
            <strong style={{ color: '#0f172a' }}>{totalPages}</strong>
          </span>
        )}

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows:</span>
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                height: 28,
                padding: '0 6px',
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage <= 1 ? '#cbd5e1' : '#334155',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s ease',
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94a3b8' }}>
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(p as number)}
              aria-current={isCurrent ? 'page' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 30,
                height: 30,
                padding: '0 8px',
                borderRadius: 6,
                border: isCurrent ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                background: isCurrent ? '#eef2ff' : '#ffffff',
                color: isCurrent ? '#4338ca' : '#334155',
                fontSize: 12,
                fontWeight: isCurrent ? 600 : 500,
                fontVariantNumeric: 'tabular-nums',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s ease',
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
