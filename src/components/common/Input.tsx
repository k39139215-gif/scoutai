import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span style={{ color: 'var(--color-danger)', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {icon && (
            <div
              style={{
                position: 'absolute',
                left: 12,
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`form-input ${className}`}
            style={{
              paddingLeft: icon ? 36 : 12,
              paddingRight: iconRight ? 36 : 12,
              borderColor: error ? 'var(--color-danger)' : undefined,
            }}
            {...props}
          />
          {iconRight && (
            <div
              style={{
                position: 'absolute',
                right: 12,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {iconRight}
            </div>
          )}
        </div>
        {error && <span className="form-error">{error}</span>}
        {helperText && !error && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
            {props.required && <span style={{ color: 'var(--color-danger)', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`form-textarea ${className}`}
          style={{
            borderColor: error ? 'var(--color-danger)' : undefined,
            minHeight: 90,
            resize: 'vertical',
          }}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
        {helperText && !error && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
