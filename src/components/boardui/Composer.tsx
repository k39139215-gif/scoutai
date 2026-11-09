import React, { useRef } from 'react';
import { Sparkles, Send, Tag } from 'lucide-react';
import { AgentThinking } from './AgentThinking';

export interface ComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSend?: () => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  availableTokens?: string[];
  toneControl?: React.ReactNode;
  primaryActionLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BoardUI Composer Component (Free / MIT)
 * AI-native rich message composer with variable token insertion and generation triggers.
 */
export const Composer: React.FC<ComposerProps> = ({
  value,
  onChange,
  onSend,
  onRegenerate,
  isGenerating = false,
  placeholder = 'Draft your candidate outreach pitch...',
  availableTokens = ['{{candidate_name}}', '{{role}}', '{{company}}', '{{key_skill}}'],
  toneControl,
  primaryActionLabel = 'Send Message',
  className = '',
  style = {},
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertToken = (token: string) => {
    if (!textareaRef.current) {
      onChange(value + ' ' + token);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const nextVal = value.substring(0, start) + token + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + token.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend?.();
    }
  };

  return (
    <div
      className={`boardui-composer-card ${className}`}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
    >
      {/* Top Bar: Tone Controls & AI Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '10px 14px',
          background: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {toneControl}
        </div>

        {isGenerating ? (
          <AgentThinking label="AI Generating pitch..." size="sm" />
        ) : onRegenerate ? (
          <button
            type="button"
            onClick={onRegenerate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 500,
              color: '#4f46e5',
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              padding: '3px 9px',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e7ff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#eef2ff')}
          >
            <Sparkles size={12} />
            <span>Regenerate with AI</span>
          </button>
        ) : null}
      </div>

      {/* Main Textarea */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isGenerating}
          rows={6}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontSize: 13,
            lineHeight: 1.6,
            color: '#1e293b',
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Bottom Token Bar & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '8px 14px',
          background: '#fafafa',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {/* Token Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tag size={10} />
            <span>Tokens:</span>
          </span>
          {availableTokens.map((tok) => (
            <button
              key={tok}
              type="button"
              onClick={() => insertToken(tok)}
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '1.5px 6px',
                borderRadius: 4,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              {tok}
            </button>
          ))}
        </div>

        {/* Action Button & Shortcut Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              color: '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <kbd style={{ fontSize: 10, background: '#f1f5f9', padding: '1px 4px', borderRadius: 3, border: '1px solid #e2e8f0' }}>⌘</kbd>
            <kbd style={{ fontSize: 10, background: '#f1f5f9', padding: '1px 4px', borderRadius: 3, border: '1px solid #e2e8f0' }}>↵</kbd>
          </span>

          {onSend && (
            <button
              type="button"
              onClick={onSend}
              disabled={isGenerating || !value.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                cursor: isGenerating || !value.trim() ? 'not-allowed' : 'pointer',
                opacity: isGenerating || !value.trim() ? 0.6 : 1,
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && value.trim()) e.currentTarget.style.background = '#1e293b';
              }}
              onMouseLeave={(e) => {
                if (!isGenerating && value.trim()) e.currentTarget.style.background = '#0f172a';
              }}
            >
              <Send size={12} />
              <span>{primaryActionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
