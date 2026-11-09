import React, { useRef } from 'react';
import { Sparkles, ArrowUp, Tag, Check, Copy } from 'lucide-react';
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
 * Official BoardUI Composer Component
 * Figma source: Board UI -> Agent Chat -> Composer (node 4030:5993)
 * Features pill form architecture, iridescent glowing loader state,
 * circular tactile actions, variable tokens ribbon, and model status line.
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
  const [copied, setCopied] = React.useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div
      className={`boardui-composer-card ${className}`}
      style={{
        position: 'relative',
        background: '#ffffff',
        border: isGenerating
          ? '1px solid #818cf8'
          : '1px solid var(--border-subtle, #e2e8f0)',
        borderRadius: 14,
        boxShadow: isGenerating
          ? '0 0 0 3px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(99, 102, 241, 0.08)'
          : '0 1px 3px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {/* Top Header: Tone Selector & AI Sparkle Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '10px 14px',
          background: 'var(--bg-subtle, #f8fafc)',
          borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {toneControl}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isGenerating ? (
            <AgentThinking label="AI synthesizing outreach pitch..." size="sm" />
          ) : (
            <>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#4338ca',
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e7ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#eef2ff')}
                >
                  <Sparkles size={12} />
                  <span>Regenerate Pitch</span>
                </button>
              )}

              <button
                type="button"
                onClick={copyToClipboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '4px 9px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                {copied ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Textarea Area */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            fontSize: 13.5,
            lineHeight: 1.6,
            color: 'var(--text-primary, #0f172a)',
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Variable Tokens Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          background: '#ffffff',
          borderTop: '1px dashed var(--border-subtle, #f1f5f9)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#475569',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginRight: 2,
          }}
        >
          <Tag size={11} />
          <span>Insert Token:</span>
        </span>

        {availableTokens.map((tok) => (
          <button
            key={tok}
            type="button"
            onClick={() => insertToken(tok)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'monospace',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '2px 8px',
              borderRadius: 6,
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c7d2fe';
              e.currentTarget.style.background = '#eef2ff';
              e.currentTarget.style.color = '#4338ca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = '#334155';
            }}
          >
            {tok}
          </button>
        ))}
      </div>

      {/* BoardUI Footer Status Bar & Submit Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 14px',
          background: 'var(--bg-subtle, #f8fafc)',
          borderTop: '1px solid var(--border-subtle, #f1f5f9)',
        }}
      >
        {/* Left Status: Stats + Simulation Notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
            {wordCount} words • {charCount} chars
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#334155',
              background: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: 9999,
            }}
          >
            Simulation mode
          </span>
        </div>

        {/* Right Action: Circular / Tactile Send Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              color: '#475569',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <kbd style={{ fontSize: 12, background: '#ffffff', padding: '1px 5px', borderRadius: 4, border: '1px solid #cbd5e1' }}>⌘</kbd>
            <kbd style={{ fontSize: 12, background: '#ffffff', padding: '1px 5px', borderRadius: 4, border: '1px solid #cbd5e1' }}>↵</kbd>
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
                padding: '7px 16px',
                borderRadius: 9999,
                fontSize: 12.5,
                fontWeight: 600,
                background: isGenerating || !value.trim() ? '#94a3b8' : 'var(--color-primary-button, #0f172a)',
                color: '#ffffff',
                border: 'none',
                cursor: isGenerating || !value.trim() ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.12)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && value.trim()) {
                  e.currentTarget.style.background = '#1e293b';
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating && value.trim()) {
                  e.currentTarget.style.background = 'var(--color-primary-button, #0f172a)';
                }
              }}
            >
              <span>{primaryActionLabel}</span>
              <ArrowUp size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
