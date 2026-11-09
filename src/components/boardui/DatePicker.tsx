import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DatePickerProps {
  value?: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  presets?: { label: string; daysFromNow: number }[];
  className?: string;
  style?: React.CSSProperties;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Official BoardUI Calendar DatePicker Component
 * Figma source: Board UI -> Components -> Inputs -> DatePicker
 * Features month navigation, clean weekday grid, active day accent tile,
 * and quick presets ribbon.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date...',
  size = 'md',
  presets = [
    { label: 'Today', daysFromNow: 0 },
    { label: 'Tomorrow', daysFromNow: 1 },
    { label: 'Next Week', daysFromNow: 7 },
  ],
  className = '',
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or default to current date
  const parsedDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateStr(viewYear, viewMonth, day);
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSelectPreset = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    const dateStr = formatDateStr(target.getFullYear(), target.getMonth(), target.getDate());
    onChange(dateStr);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  // Calendar math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const isSmall = size === 'sm';
  const height = isSmall ? 32 : 36;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', ...style }} className={className}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height,
          padding: '0 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#ffffff',
          border: `1px solid ${isOpen ? '#4338ca' : '#cbd5e1'}`,
          borderRadius: 8,
          fontSize: isSmall ? 12.5 : 13,
          fontWeight: 500,
          color: value ? '#0f172a' : '#94a3b8',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(67, 56, 202, 0.15)' : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'all 0.12s ease',
        }}
      >
        <CalendarIcon size={14} style={{ color: value ? '#4338ca' : '#64748b' }} />
        <span>{value || placeholder}</span>
        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            style={{
              padding: 2,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              color: '#94a3b8',
              marginLeft: 'auto',
            }}
          >
            <X size={12} />
          </span>
        )}
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 9999,
            width: 270,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 12,
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)',
            padding: '14px',
            userSelect: 'none',
            animation: 'boarduiDropdownEnter 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Month Header Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Quick Presets */}
          {presets.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
              {presets.map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() => handleSelectPreset(pr.daysFromNow)}
                  style={{
                    padding: '2px 8px',
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          )}

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center', marginBottom: 4 }}>
            {WEEKDAYS.map((day) => (
              <span key={day} style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', padding: '4px 0' }}>
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day buttons */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateStr(viewYear, viewMonth, day);
              const isSelected = value === dateKey;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 6,
                    border: isSelected ? '1px solid #4338ca' : '1px solid transparent',
                    background: isSelected ? '#4338ca' : 'transparent',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
