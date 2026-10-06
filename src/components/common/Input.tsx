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
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 6 }}>
        {label && (
          <label
            htmlFor={inputId}
            className="form-label"
            style={{ fontSize: 13, fontWeight: 500, color: '#18181b', display: 'block' }}
          >
            {label}
            {props.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {icon && (
            <div
              style={{
                position: 'absolute',
                left: 12,
                color: '#71717a',
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
              width: '100%',
              boxSizing: 'border-box',
              height: 36,
              paddingLeft: icon ? 36 : 12,
              paddingRight: iconRight ? 36 : 12,
              borderColor: error ? '#ef4444' : '#e4e4e7',
              fontSize: 13,
              borderRadius: 8,
              border: error ? '1px solid #ef4444' : '1px solid #e4e4e7',
              color: '#18181b',
              background: '#ffffff',
              fontFamily: 'inherit',
              outline: 'none',
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
                color: '#71717a',
              }}
            >
              {iconRight}
            </div>
          )}
        </div>
        {error && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{error}</span>}
        {helperText && !error && (
          <span style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
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
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 6 }}>
        {label && (
          <label
            htmlFor={textareaId}
            className="form-label"
            style={{ fontSize: 13, fontWeight: 500, color: '#18181b', display: 'block' }}
          >
            {label}
            {props.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`form-textarea ${className}`}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 8,
            border: error ? '1px solid #ef4444' : '1px solid #e4e4e7',
            padding: '10px 12px',
            fontSize: 13,
            lineHeight: 1.5,
            color: '#18181b',
            background: '#ffffff',
            fontFamily: 'inherit',
            outline: 'none',
            minHeight: 110,
            resize: 'vertical',
          }}
          {...props}
        />
        {error && <span style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{error}</span>}
        {helperText && !error && (
          <span style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
