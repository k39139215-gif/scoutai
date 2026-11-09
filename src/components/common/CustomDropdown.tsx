import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  prefix?: string;
  size?: 'sm' | 'md';
  variant?: 'outline' | 'subtle' | 'ghost' | 'pill';
  direction?: 'down' | 'up' | 'auto';
  align?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  menuWidth?: number | string;
}

interface CustomMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  direction?: 'down' | 'up' | 'auto';
  align?: 'left' | 'right';
  menuWidth?: number | string;
}

/**
 * 1. Custom Select Dropdown (Portal-based: NEVER clipped by table or container overflow)
 */
export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  icon,
  prefix,
  size = 'md',
  variant = 'outline',
  direction = 'auto',
  align = 'left',
  style,
  menuWidth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    dropUp: boolean;
  }>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    dropUp: false,
  });

  const selectedOption = options.find((o) => o.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldDropUp =
      direction === 'up' || (direction === 'auto' && spaceBelow < 240 && spaceAbove > spaceBelow);

    setCoords({
      top: rect.bottom + 4,
      bottom: window.innerHeight - rect.top + 4,
      left: rect.left,
      right: window.innerWidth - rect.right,
      width: rect.width,
      dropUp: shouldDropUp,
    });
  }, [direction]);

  // Click outside to close (without swallowing clicks on external buttons)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        // Defer unmounting to the next frame so any concurrent button click executes immediately
        setTimeout(() => {
          setIsOpen(false);
        }, 0);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const toggleOpen = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const height = size === 'sm' ? 32 : 36;
  const fontSize = size === 'sm' ? 12.5 : 13.5;
  const padding = size === 'sm' ? '0 10px' : '0 12px';

  let bg = '#ffffff';
  let border = '1px solid #e4e4e7';
  let color = '#18181b';

  if (variant === 'subtle') {
    bg = '#f4f4f5';
    border = '1px solid transparent';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    border = '1px solid transparent';
  } else if (variant === 'pill') {
    bg = '#ffffff';
    border = '1px solid #e4e4e7';
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        style={{
          height,
          padding,
          fontSize,
          fontWeight: 500,
          background: bg,
          color,
          border,
          borderRadius: variant === 'pill' ? 9999 : 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(24, 24, 27, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isOpen && variant !== 'subtle') e.currentTarget.style.borderColor = '#d4d4d8';
        }}
        onMouseLeave={(e) => {
          if (!isOpen && variant !== 'subtle') e.currentTarget.style.borderColor = '#e4e4e7';
        }}
      >
        {icon && <span style={{ color: '#71717a', display: 'flex' }}>{icon}</span>}
        {prefix && <span style={{ color: '#71717a', fontWeight: 400 }}>{prefix}</span>}
        <span style={{ color: selectedOption ? '#18181b' : '#a1a1aa' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#71717a',
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isOpen
              ? coords.dropUp
                ? 'rotate(0deg)'
                : 'rotate(180deg)'
              : coords.dropUp
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
            marginLeft: 2,
          }}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.dropUp ? undefined : coords.top,
              bottom: coords.dropUp ? coords.bottom : undefined,
              left: align === 'right' ? undefined : coords.left,
              right: align === 'right' ? coords.right : undefined,
              minWidth: menuWidth === '100%' ? coords.width : (typeof menuWidth === 'number' ? menuWidth : Math.max(coords.width, 140)),
              width: menuWidth === '100%' ? coords.width : (typeof menuWidth === 'number' ? menuWidth : 'max-content'),
              maxWidth: menuWidth === '100%' ? coords.width : Math.min(Math.max(coords.width, 420), window.innerWidth - 32),
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              boxShadow:
                '0 12px 32px -4px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
              padding: 4,
              zIndex: 99999,
              maxHeight: 280,
              overflowY: 'auto',
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#18181b' : '#3f3f46',
                    background: isSelected ? '#f4f4f5' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                    gap: 12,
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {option.icon && (
                      <span style={{ color: isSelected ? '#18181b' : '#71717a' }}>{option.icon}</span>
                    )}
                    <div>
                      <div>{option.label}</div>
                      {option.description && (
                        <div style={{ fontSize: 11, color: '#71717a', marginTop: 1 }}>
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {option.badge && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: '#e4e4e7',
                          color: '#3f3f46',
                        }}
                      >
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check size={14} style={{ color: '#18181b' }} />}
                  </div>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

/**
 * 2. Custom Action Menu Dropdown (Portal-based: NEVER clipped by table or container overflow)
 */
export const CustomMenu: React.FC<CustomMenuProps> = ({
  trigger,
  items,
  direction = 'auto',
  align = 'left',
  menuWidth = 210,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerWrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
    dropUp: boolean;
  }>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    dropUp: false,
  });

  const updatePosition = useCallback(() => {
    if (!triggerWrapRef.current) return;
    const rect = triggerWrapRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldDropUp =
      direction === 'up' || (direction === 'auto' && spaceBelow < 240 && spaceAbove > spaceBelow);

    setCoords({
      top: rect.bottom + 4,
      bottom: window.innerHeight - rect.top + 4,
      left: rect.left,
      right: window.innerWidth - rect.right,
      dropUp: shouldDropUp,
    });
  }, [direction]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerWrapRef.current &&
        !triggerWrapRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setTimeout(() => {
          setIsOpen(false);
        }, 0);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const toggleOpen = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        ref={triggerWrapRef}
        onClick={toggleOpen}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.dropUp ? undefined : coords.top,
              bottom: coords.dropUp ? coords.bottom : undefined,
              left: align === 'right' ? undefined : coords.left,
              right: align === 'right' ? coords.right : undefined,
              width: menuWidth,
              maxWidth: 'calc(100vw - 24px)',
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              boxShadow:
                '0 12px 32px -4px rgba(0, 0, 0, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
              padding: 5,
              zIndex: 99999,
              boxSizing: 'border-box',
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: item.danger ? '#dc2626' : '#27272a',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.danger ? '#fef2f2' : '#f4f4f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {item.icon && (
                    <span style={{ color: item.danger ? '#dc2626' : '#71717a' }}>{item.icon}</span>
                  )}
                  <div>
                    <div>{item.label}</div>
                    {item.description && (
                      <div style={{ fontSize: 11, color: '#71717a', marginTop: 1 }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: '#e4e4e7',
                      color: '#3f3f46',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
