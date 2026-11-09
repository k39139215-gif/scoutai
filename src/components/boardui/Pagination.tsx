import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomSelect } from '../common/CustomDropdown';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
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
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  className = '',
  style = {},
}) => {
  const startItem = totalItems !== undefined ? Math.min((currentPage - 1) * pageSize + 1, totalItems) : 0;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : 0;

  // Build page number list with ellipsis for > 7 pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
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
        gap: 16,
        padding: '12px 20px',
        background: '#ffffff',
        borderTop: '1px solid #e4e4e7',
        fontSize: 13,
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Left: Item Range Count & Rows Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#475569', flexWrap: 'wrap' }}>
        {totalItems !== undefined ? (
          <span style={{ fontVariantNumeric: 'tabular-nums', color: '#64748b' }}>
            Showing <strong style={{ color: '#0f172a', fontWeight: 600 }}>{startItem}–{endItem}</strong> of{' '}
            <strong style={{ color: '#0f172a', fontWeight: 600 }}>{totalItems}</strong> entries
          </span>
        ) : (
          <span style={{ color: '#64748b' }}>
            Page <strong style={{ color: '#0f172a', fontWeight: 600 }}>{currentPage}</strong> of{' '}
            <strong style={{ color: '#0f172a', fontWeight: 600 }}>{totalPages}</strong>
          </span>
        )}

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <span style={{ color: '#64748b' }}>Rows:</span>
            <CustomSelect
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              options={pageSizeOptions.map((opt) => ({
                value: String(opt),
                label: `${opt}`,
              }))}
              size="sm"
              menuWidth={90}
            />
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage <= 1 ? '#cbd5e1' : '#334155',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s ease',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }
          }}
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94a3b8', fontSize: 13 }}>
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              type="button"
              className="pill"
              onClick={() => onPageChange(Number(p))}
              aria-current={isCurrent ? 'page' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
                height: 32,
                padding: '0 8px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: isCurrent ? 600 : 500,
                border: isCurrent ? '1px solid #0f172a' : '1px solid #e2e8f0',
                background: isCurrent ? '#0f172a' : '#ffffff',
                color: isCurrent ? '#ffffff' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
                fontVariantNumeric: 'tabular-nums',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
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
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s ease',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
