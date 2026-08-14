import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  iconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  iconOnly = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = `snow-btn-${variant}`;
  const sizeClass = `snow-btn-${size}`;
  const iconOnlyStyle = iconOnly ? { padding: '0 8px', width: size === 'sm' ? 28 : size === 'lg' ? 40 : 34 } : {};

  return (
    <button
      className={`snow-btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      style={{ ...iconOnlyStyle, ...(props.style || {}) }}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 13 : 15} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        icon
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </button>
  );
};
