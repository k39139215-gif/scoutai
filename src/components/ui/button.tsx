import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'destructive-outline'
  | 'link';

export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'xl'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * Coss UI Button Component (Built on Base UI / Coss Design System spec)
 * Matches the official @coss/button registry specification.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      size = 'default',
      loading = false,
      disabled = false,
      icon,
      iconRight,
      style,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Size dimensions
    let height = 34;
    let padding = '0 12px';
    let fontSize = 13;
    let iconSize = 15;
    let borderRadius = 8;

    if (size === 'xs') {
      height = 24;
      padding = '0 8px';
      fontSize = 11;
      iconSize = 12;
      borderRadius = 5;
    } else if (size === 'sm') {
      height = 28;
      padding = '0 10px';
      fontSize = 12;
      iconSize = 13;
      borderRadius = 6;
    } else if (size === 'lg') {
      // p-button-10 (Large Button)
      height = 40;
      padding = '0 16px';
      fontSize = 14;
      iconSize = 16;
      borderRadius = 8;
    } else if (size === 'xl') {
      height = 44;
      padding = '0 20px';
      fontSize = 15;
      iconSize = 18;
      borderRadius = 9;
    } else if (size === 'icon') {
      height = 34;
      padding = '0';
      fontSize = 13;
      iconSize = 16;
      borderRadius = 8;
    } else if (size === 'icon-sm') {
      height = 28;
      padding = '0';
      fontSize = 12;
      iconSize = 14;
      borderRadius = 6;
    } else if (size === 'icon-lg') {
      height = 40;
      padding = '0';
      fontSize = 14;
      iconSize = 18;
      borderRadius = 8;
    }

    const isIconOnly = size.startsWith('icon');
    const width = isIconOnly ? height : undefined;

    // Variant color tokens
    let bg = '#18181b';
    let color = '#ffffff';
    let border = '1px solid #18181b';
    let boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.16)';

    if (variant === 'secondary') {
      bg = '#f4f4f5';
      color = '#18181b';
      border = '1px solid transparent';
      boxShadow = 'none';
    } else if (variant === 'outline') {
      bg = '#ffffff';
      color = '#18181b';
      border = '1px solid #e4e4e7';
      boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)';
    } else if (variant === 'ghost') {
      bg = 'transparent';
      color = '#18181b';
      border = '1px solid transparent';
      boxShadow = 'none';
    } else if (variant === 'destructive') {
      bg = '#dc2626';
      color = '#ffffff';
      border = '1px solid #dc2626';
      boxShadow = '0 1px 2px rgba(220, 38, 38, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.16)';
    } else if (variant === 'destructive-outline') {
      bg = '#ffffff';
      color = '#dc2626';
      border = '1px solid #fecaca';
      boxShadow = 'none';
    } else if (variant === 'link') {
      bg = 'transparent';
      color = '#18181b';
      border = 'none';
      boxShadow = 'none';
      padding = '0';
      height = 'auto' as any;
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`coss-btn coss-btn-${variant} coss-btn-${size} ${className}`}
        style={{
          height,
          width,
          padding: isIconOnly ? 0 : padding,
          fontSize,
          fontWeight: 500,
          background: bg,
          color,
          border,
          borderRadius,
          boxShadow,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
          textDecoration: variant === 'link' ? 'underline' : 'none',
          outline: 'none',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          transition:
            'background-color 0.08s ease, border-color 0.08s ease, box-shadow 0.08s ease, transform 0.03s cubic-bezier(0.16, 1, 0.3, 1)',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (isDisabled) return;
          if (variant === 'default') {
            e.currentTarget.style.background = '#27272a';
            e.currentTarget.style.borderColor = '#27272a';
          } else if (variant === 'secondary') {
            e.currentTarget.style.background = '#e4e4e7';
          } else if (variant === 'outline') {
            e.currentTarget.style.background = '#f4f4f5';
            e.currentTarget.style.borderColor = '#d4d4d8';
          } else if (variant === 'ghost') {
            e.currentTarget.style.background = '#f4f4f5';
          } else if (variant === 'destructive') {
            e.currentTarget.style.background = '#b91c1c';
            e.currentTarget.style.borderColor = '#b91c1c';
          } else if (variant === 'destructive-outline') {
            e.currentTarget.style.background = '#fef2f2';
          }
        }}
        onMouseLeave={(e) => {
          if (isDisabled) return;
          e.currentTarget.style.background = bg;
          e.currentTarget.style.borderColor = (border.split(' ')[2] || 'transparent');
        }}
        {...props}
      >
        {loading ? (
          <Loader2 size={iconSize} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          icon
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
