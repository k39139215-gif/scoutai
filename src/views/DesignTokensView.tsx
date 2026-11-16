import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Plus,
  Briefcase,
  Users,
  Calendar,
  ExternalLink,
  UserCheck,
  Wifi,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import {
  colors,
  typography,
  radii,
  shadows,
  motion,
  componentTokens,
} from '../tokens';

export const DesignTokensView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [segmentMode, setSegmentMode] = useState<'all' | 'high' | 'medium' | 'low'>('medium');
  const [darkSegmentMode, setDarkSegmentMode] = useState<'all' | 'high' | 'medium' | 'low'>('medium');
  const [offlineToggle, setOfflineToggle] = useState(true);
  const showToastPreview = true;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 1400,
        margin: '0 auto',
        paddingBottom: 100,
        fontFamily: typography.fontFamily.base,
        color: colors.gray[900].hex,
      }}
    >
      {/* ── 1. HEADER ────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${colors.gray[200].hex}`, paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: radii.full,
              background: colors.success[50].hex,
              border: `1px solid ${colors.success[200].hex}`,
              color: colors.success[700].hex,
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Sparkles size={13} />
            <span>Design System v2.0 · Source of Truth</span>
          </div>
        </div>
        <h1
          style={{
            fontSize: typography.fontSize['3xl'],
            lineHeight: '32px',
            fontWeight: typography.fontWeight.semibold,
            letterSpacing: typography.letterSpacing.tight,
            margin: 0,
            color: colors.gray[900].hex,
          }}
        >
          Reference Design Token System
        </h1>
        <p style={{ fontSize: typography.fontSize.base, color: colors.gray[600].hex, margin: '6px 0 0 0' }}>
          Exact tokens mathematically sampled from Untitled UI, Gr8r Studio, and Halo references. Includes color ramps, typography scales, concentric radii, elevation shadows, and production components.
        </p>
      </div>

      {/* ── 2. COLOR PALETTES (HEX & HSL WITH COPY) ─────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, margin: 0 }}>
            1. Color System (HEX & HSL Ramps)
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600].hex, margin: '4px 0 0 0' }}>
            Click any swatch to copy value. Notice the `#101828` slate-ink hue (220° cool undertone) eliminating glare.
          </p>
        </div>

        {/* Gray Scale */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.gray[700].hex, marginBottom: 10 }}>
            Gray / Neutral Ramp (Untitled UI Slate)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: 10 }}>
            {Object.entries(colors.gray).map(([shade, item]) => {
              const isDark = parseInt(shade, 10) >= 600;
              const isCopied = copiedKey === `gray-${shade}`;
              return (
                <div
                  key={shade}
                  onClick={() => handleCopy(item.hex, `gray-${shade}`)}
                  style={{
                    background: item.hex,
                    borderRadius: radii.md,
                    border: `1px solid ${parseInt(shade, 10) < 200 ? colors.gray[200].hex : 'transparent'}`,
                    padding: '12px 10px',
                    minHeight: 80,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: shadows.xs,
                    transition: motion.transitions.default,
                  }}
                  title={(item as { description?: string; hsl?: string }).description || (item as { description?: string; hsl?: string }).hsl}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#ffffff' : colors.gray[900].hex }}>
                      {shade}
                    </span>
                    {isCopied ? (
                      <Check size={12} style={{ color: isDark ? '#ffffff' : colors.gray[900].hex }} />
                    ) : (
                      <Copy size={11} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : colors.gray[400].hex }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#ffffff' : colors.gray[900].hex }}>
                      {item.hex}
                    </div>
                    <div style={{ fontSize: 9.5, color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray[500].hex }}>
                      {item.hsl.replace('hsl(', '').replace(')', '')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semantic Color Rows: Success, Warning, Error */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* Success */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.success[700].hex, marginBottom: 8 }}>
              Success / Match Fit Ramp (Emerald)
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { shade: '50', hex: colors.success[50].hex, desc: 'Pill Bg' },
                { shade: '200', hex: colors.success[200].hex, desc: 'Pill Border' },
                { shade: '500', hex: colors.success[500].hex, desc: 'Live Dot' },
                { shade: '700', hex: colors.success[700].hex, desc: 'Text (AAA)' },
              ].map((sw) => (
                <div
                  key={sw.shade}
                  onClick={() => handleCopy(sw.hex, `succ-${sw.shade}`)}
                  style={{
                    flex: 1,
                    minWidth: 64,
                    background: sw.hex,
                    border: `1px solid ${colors.success[200].hex}`,
                    borderRadius: radii.md,
                    padding: '8px',
                    cursor: 'pointer',
                    color: parseInt(sw.shade, 10) >= 500 ? '#ffffff' : colors.success[700].hex,
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700 }}>{sw.shade}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>{sw.hex}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>{sw.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.warning[700].hex, marginBottom: 8 }}>
              Warning / Paused Ramp (Amber)
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { shade: '50', hex: colors.warning[50].hex, desc: 'Pill Bg' },
                { shade: '200', hex: colors.warning[200].hex, desc: 'Pill Border' },
                { shade: '500', hex: colors.warning[500].hex, desc: 'Dot' },
                { shade: '700', hex: colors.warning[700].hex, desc: 'Text (AAA)' },
              ].map((sw) => (
                <div
                  key={sw.shade}
                  onClick={() => handleCopy(sw.hex, `warn-${sw.shade}`)}
                  style={{
                    flex: 1,
                    minWidth: 64,
                    background: sw.hex,
                    border: `1px solid ${colors.warning[200].hex}`,
                    borderRadius: radii.md,
                    padding: '8px',
                    cursor: 'pointer',
                    color: parseInt(sw.shade, 10) >= 500 ? '#ffffff' : colors.warning[700].hex,
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700 }}>{sw.shade}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>{sw.hex}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>{sw.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.error[700].hex, marginBottom: 8 }}>
              Error / Archive Ramp (Rose)
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { shade: '50', hex: colors.error[50].hex, desc: 'Hover Bg' },
                { shade: '200', hex: colors.error[200].hex, desc: 'Border' },
                { shade: '500', hex: colors.error[500].hex, desc: 'Icon' },
                { shade: '700', hex: colors.error[700].hex, desc: 'Action Red' },
              ].map((sw) => (
                <div
                  key={sw.shade}
                  onClick={() => handleCopy(sw.hex, `err-${sw.shade}`)}
                  style={{
                    flex: 1,
                    minWidth: 64,
                    background: sw.hex,
                    border: `1px solid ${colors.error[200].hex}`,
                    borderRadius: radii.md,
                    padding: '8px',
                    cursor: 'pointer',
                    color: parseInt(sw.shade, 10) >= 500 ? '#ffffff' : colors.error[700].hex,
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700 }}>{sw.shade}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>{sw.hex}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>{sw.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TYPOGRAPHY SCALE ───────────────────────────────────── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, margin: 0 }}>
            2. Typography Scale (Inter & Tabular Numerics)
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600].hex, margin: '4px 0 0 0' }}>
            Strict letter-spacing calibration: -0.02em tracking on 24px headings, +0.01em on 12px table headers.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: `1px solid ${colors.gray[200].hex}`,
            borderRadius: radii.xl,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {[
            { name: 'Page Title (3xl)', size: '24px', weight: '600', tracking: '-0.02em', preview: 'All Candidates & Requisitions' },
            { name: 'Section Heading (lg)', size: '16px', weight: '600', tracking: '-0.01em', preview: 'Workflows & Pipeline Automation' },
            { name: 'Body / Candidate Name (base)', size: '13.5px', weight: '600', tracking: '0', preview: 'Sarah Chen · Senior Frontend Engineer' },
            { name: 'Secondary Meta / Dropdown (sm)', size: '12.5px', weight: '400', tracking: '0', preview: 'sarah.chen.demo@example.com · 6 Years Production' },
            { name: 'Table Column Header (xs)', size: '11.5px', weight: '500', tracking: '+0.01em', preview: 'TARGET REQUISITION · VERIFIED SKILLS · AI MATCH' },
            { name: 'Status Pill / Chip (2xs)', size: '10.5px', weight: '600', tracking: '+0.01em', preview: 'GRADE A VERIFIED · 91% MATCH' },
          ].map((type, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                alignItems: 'center',
                paddingBottom: 14,
                borderBottom: idx < 5 ? `1px solid ${colors.gray[100].hex}` : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.gray[900].hex }}>{type.name}</div>
                <div style={{ fontSize: 11, color: colors.gray[500].hex }}>
                  {type.size} / {type.weight} / {type.tracking}
                </div>
              </div>
              <div
                style={{
                  fontSize: type.size,
                  fontWeight: type.weight as any,
                  letterSpacing: type.tracking,
                  color: colors.gray[900].hex,
                }}
              >
                {type.preview}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. CONCENTRIC RADII & SHADOWS ────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Radii */}
        <div>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, margin: '0 0 12px 0' }}>
            3. Concentric Radii Math
          </h2>
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {[
              { token: 'radii.xl (12px)', role: 'Outer Card Container', r: radii.xl },
              { token: 'radii.lg (10px)', role: 'Dropdown Menu Popover', r: radii.lg },
              { token: 'radii.md (8px)', role: 'Inner Icon Wrapper & Input', r: radii.md },
              { token: 'radii.sm (6px)', role: 'Segment Pill & Dropdown Item', r: radii.sm },
              { token: 'radii.xs (4px)', role: 'Checkbox & Skill Chip', r: radii.xs },
              { token: 'radii.full (9999px)', role: 'Match Pill & Switch Track', r: radii.full },
            ].map((rad) => (
              <div key={rad.token} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.gray[900].hex }}>{rad.token}</div>
                  <div style={{ fontSize: 11, color: colors.gray[500].hex }}>{rad.role}</div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 24,
                    background: colors.gray[100].hex,
                    border: `1.5px solid ${colors.gray[900].hex}`,
                    borderRadius: rad.r,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Elevation Shadows */}
        <div>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, margin: '0 0 12px 0' }}>
            4. Elevation Shadows (Cool Diffuse)
          </h2>
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {[
              { name: 'Resting Card (xs)', shadow: shadows.xs, desc: '0 1px 2px rgba(16,24,40,0.05)' },
              { name: 'Segment Pill Active (sm)', shadow: shadows.sm, desc: '0 1px 3px rgba(16,24,40,0.08)' },
              { name: 'Card Hover (md)', shadow: shadows.md, desc: '0 4px 10px -2px rgba(16,24,40,0.06)' },
              { name: 'Dropdown Menu (dropdown)', shadow: shadows.dropdown, desc: '0 12px 24px -4px rgba(16,24,40,0.12)' },
              { name: 'Undo Toast (toast)', shadow: shadows.toast, desc: '0 20px 24px -4px rgba(16,24,40,0.08)' },
            ].map((sh) => (
              <div
                key={sh.name}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${colors.gray[200].hex}`,
                  borderRadius: radii.md,
                  padding: '10px 14px',
                  boxShadow: sh.shadow,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.gray[900].hex }}>{sh.name}</div>
                  <div style={{ fontSize: 10.5, color: colors.gray[500].hex }}>{sh.desc}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.success[700].hex }}>Active</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRODUCTION COMPONENT PRIMITIVES (Live Reference Preview) ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: typography.fontSize.lg, fontWeight: 600, margin: 0 }}>
            5. Component Primitives (Live Reference Match)
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[600].hex, margin: '4px 0 0 0' }}>
            Interactive components built 100% from the token system above.
          </p>
        </div>

        {/* 5A. Quick Action Card (Untitled UI Image 10) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            { label: 'Post Requisition', icon: Briefcase, desc: 'Draft new hiring requirements' },
            { label: 'Ingest Candidates', icon: Users, desc: 'Sync resumes & LinkedIn profiles' },
            { label: 'Schedule Interview', icon: Calendar, desc: 'Coordinate technical screen' },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                style={{
                  ...componentTokens.quickActionCard,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: motion.transitions.default,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = componentTokens.quickActionCard.hover.borderColor;
                  e.currentTarget.style.boxShadow = componentTokens.quickActionCard.hover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.gray[200].hex;
                  e.currentTarget.style.boxShadow = componentTokens.quickActionCard.boxShadow;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: componentTokens.quickActionCard.iconBox.width,
                      height: componentTokens.quickActionCard.iconBox.height,
                      borderRadius: componentTokens.quickActionCard.iconBox.borderRadius,
                      background: componentTokens.quickActionCard.iconBox.background,
                      border: componentTokens.quickActionCard.iconBox.border,
                      display: 'grid',
                      placeItems: 'center',
                      color: componentTokens.quickActionCard.iconBox.color,
                    }}
                  >
                    <Icon size={componentTokens.quickActionCard.iconBox.iconSize} />
                  </div>
                  <div>
                    <div style={componentTokens.quickActionCard.title}>{card.label}</div>
                    <div style={componentTokens.quickActionCard.description}>{card.desc}</div>
                  </div>
                </div>
                <Plus size={componentTokens.quickActionCard.plusIcon.size} style={{ color: componentTokens.quickActionCard.plusIcon.color }} />
              </div>
            );
          })}
        </div>

        {/* 5B. Exact 3-Bar Cellular Signal Segmenter (Image 9 Light & Dark) */}
        <div
          style={{
            background: '#ffffff',
            border: `1px solid ${colors.gray[200].hex}`,
            borderRadius: radii.xl,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.gray[900].hex }}>
            Image 9 Reference: 3-Bar Antenna Cellular Signal Segmenter (Light & Dark Variants)
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Light Mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.gray[500].hex }}>LIGHT VARIANT</span>
              <div
                style={{
                  display: 'inline-flex',
                  background: componentTokens.signalSegmenter.track.background,
                  padding: componentTokens.signalSegmenter.track.padding,
                  borderRadius: componentTokens.signalSegmenter.track.borderRadius,
                  gap: componentTokens.signalSegmenter.track.gap,
                }}
              >
                {[
                  { id: 'all', label: 'All', bars: [true, true, true] },
                  { id: 'high', label: 'High', bars: [true, true, true] },
                  { id: 'medium', label: 'Medium', bars: [true, true, false] },
                  { id: 'low', label: 'Low', bars: [true, false, false] },
                ].map((seg) => {
                  const active = segmentMode === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSegmentMode(seg.id as any)}
                      style={{
                        height: componentTokens.signalSegmenter.pill.height,
                        padding: componentTokens.signalSegmenter.pill.padding,
                        borderRadius: componentTokens.signalSegmenter.pill.borderRadius,
                        border: 'none',
                        background: active ? componentTokens.signalSegmenter.pill.bgActive : 'transparent',
                        color: active ? componentTokens.signalSegmenter.pill.colorActive : componentTokens.signalSegmenter.pill.colorInactive,
                        fontSize: componentTokens.signalSegmenter.pill.fontSize,
                        fontWeight: active ? componentTokens.signalSegmenter.pill.fontWeightActive as any : componentTokens.signalSegmenter.pill.fontWeightInactive as any,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: active ? componentTokens.signalSegmenter.pill.shadowActive : 'none',
                        transition: motion.transitions.default,
                      }}
                    >
                      <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: componentTokens.signalSegmenter.bars.gap, height: 10 }}>
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.low, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[0] ? (active ? colors.gray[900].hex : colors.gray[500].hex) : colors.gray[300].hex }} />
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.medium, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[1] ? (active ? colors.gray[900].hex : colors.gray[500].hex) : colors.gray[300].hex }} />
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.high, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[2] ? (active ? colors.gray[900].hex : colors.gray[500].hex) : colors.gray[300].hex }} />
                      </div>
                      <span>{seg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dark Mode Variant (Exact Image 9 Dark Segmenter) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.gray[500].hex }}>DARK VARIANT</span>
              <div
                style={{
                  display: 'inline-flex',
                  background: componentTokens.signalSegmenter.darkVariant.trackBg,
                  padding: componentTokens.signalSegmenter.track.padding,
                  borderRadius: componentTokens.signalSegmenter.track.borderRadius,
                  gap: componentTokens.signalSegmenter.track.gap,
                }}
              >
                {[
                  { id: 'all', label: 'All', bars: [true, true, true] },
                  { id: 'high', label: 'High', bars: [true, true, true] },
                  { id: 'medium', label: 'Medium', bars: [true, true, false] },
                  { id: 'low', label: 'Low', bars: [true, false, false] },
                ].map((seg) => {
                  const active = darkSegmentMode === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setDarkSegmentMode(seg.id as any)}
                      style={{
                        height: componentTokens.signalSegmenter.pill.height,
                        padding: componentTokens.signalSegmenter.pill.padding,
                        borderRadius: componentTokens.signalSegmenter.pill.borderRadius,
                        border: 'none',
                        background: active ? componentTokens.signalSegmenter.darkVariant.pillBgActive : 'transparent',
                        color: active ? componentTokens.signalSegmenter.darkVariant.colorActive : componentTokens.signalSegmenter.darkVariant.colorInactive,
                        fontSize: componentTokens.signalSegmenter.pill.fontSize,
                        fontWeight: active ? componentTokens.signalSegmenter.pill.fontWeightActive as any : componentTokens.signalSegmenter.pill.fontWeightInactive as any,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
                        transition: motion.transitions.default,
                      }}
                    >
                      <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: componentTokens.signalSegmenter.bars.gap, height: 10 }}>
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.low, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[0] ? (active ? '#ffffff' : '#94969c') : componentTokens.signalSegmenter.darkVariant.barDisabledColor }} />
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.medium, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[1] ? (active ? '#ffffff' : '#94969c') : componentTokens.signalSegmenter.darkVariant.barDisabledColor }} />
                        <span style={{ width: componentTokens.signalSegmenter.bars.width, height: componentTokens.signalSegmenter.bars.heights.high, borderRadius: componentTokens.signalSegmenter.bars.borderRadius, background: seg.bars[2] ? (active ? '#ffffff' : '#94969c') : componentTokens.signalSegmenter.darkVariant.barDisabledColor }} />
                      </div>
                      <span>{seg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5C. Image 5 Dropdown & Floating Undo Toast Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: 20 }}>
          {/* Dropdown Menu Preview */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.gray[900].hex, marginBottom: 12 }}>
              Image 5: Action Menu with Toggle
            </div>

            <div
              style={{
                width: componentTokens.dropdownMenu.width,
                background: componentTokens.dropdownMenu.background,
                borderRadius: componentTokens.dropdownMenu.borderRadius,
                border: componentTokens.dropdownMenu.border,
                boxShadow: componentTokens.dropdownMenu.boxShadow,
                padding: componentTokens.dropdownMenu.padding,
              }}
            >
              <div
                style={{
                  ...componentTokens.dropdownMenu.item,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <ExternalLink size={componentTokens.dropdownMenu.item.iconSize} />
                <span>View Full Dossier</span>
              </div>

              <div
                style={{
                  ...componentTokens.dropdownMenu.item,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <UserCheck size={componentTokens.dropdownMenu.item.iconSize} />
                <span>Shortlist for Client</span>
              </div>

              {/* Offline Toggle Switch */}
              <div
                onClick={() => setOfflineToggle(!offlineToggle)}
                style={{
                  ...componentTokens.dropdownMenu.item,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Wifi size={componentTokens.dropdownMenu.item.iconSize} />
                  <span>Available offline</span>
                </div>
                <div
                  style={{
                    width: componentTokens.dropdownMenu.toggleSwitch.trackWidth,
                    height: componentTokens.dropdownMenu.toggleSwitch.trackHeight,
                    borderRadius: componentTokens.dropdownMenu.toggleSwitch.trackBorderRadius,
                    background: offlineToggle ? componentTokens.dropdownMenu.toggleSwitch.trackBgActive : componentTokens.dropdownMenu.toggleSwitch.trackBgInactive,
                    position: 'relative',
                    transition: motion.transitions.default,
                  }}
                >
                  <div
                    style={{
                      width: componentTokens.dropdownMenu.toggleSwitch.thumbSize,
                      height: componentTokens.dropdownMenu.toggleSwitch.thumbSize,
                      borderRadius: '50%',
                      background: componentTokens.dropdownMenu.toggleSwitch.thumbColor,
                      position: 'absolute',
                      top: 2,
                      left: offlineToggle ? componentTokens.dropdownMenu.toggleSwitch.thumbOffsetActive : componentTokens.dropdownMenu.toggleSwitch.thumbOffsetInactive,
                      transition: motion.transitions.default,
                    }}
                  />
                </div>
              </div>

              <div style={componentTokens.dropdownMenu.divider} />

              <div
                style={{
                  ...componentTokens.dropdownMenu.item,
                  color: componentTokens.dropdownMenu.destructiveItem.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={componentTokens.dropdownMenu.destructiveItem.iconSize} />
                <span>Archive Candidate</span>
              </div>
            </div>
          </div>

          {/* Floating Undo Toast Card */}
          <div
            style={{
              background: '#ffffff',
              border: `1px solid ${colors.gray[200].hex}`,
              borderRadius: radii.xl,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 16,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.gray[900].hex }}>
              Image 5: Floating Undo Toast Notification
            </div>

            {showToastPreview && (
              <div
                style={{
                  width: componentTokens.undoToast.width,
                  background: componentTokens.undoToast.background,
                  borderRadius: componentTokens.undoToast.borderRadius,
                  border: componentTokens.undoToast.border,
                  boxShadow: componentTokens.undoToast.boxShadow,
                  padding: componentTokens.undoToast.padding,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: componentTokens.undoToast.iconBox.width,
                        height: componentTokens.undoToast.iconBox.height,
                        borderRadius: componentTokens.undoToast.iconBox.borderRadius,
                        background: componentTokens.undoToast.iconBox.background,
                        display: 'grid',
                        placeItems: 'center',
                        color: componentTokens.undoToast.iconBox.color,
                      }}
                    >
                      <Check size={componentTokens.undoToast.iconBox.size} />
                    </div>
                    <div>
                      <div style={componentTokens.undoToast.title}>
                        "Sarah Chen" shortlisted for client
                      </div>
                      <div style={componentTokens.undoToast.subtitle}>
                        Changes have been updated in pipeline registry.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 42 }}>
                  <span style={{ ...componentTokens.undoToast.dismissBtn, cursor: 'pointer' }}>
                    Dismiss
                  </span>
                  <span
                    style={{
                      ...componentTokens.undoToast.restoreBtn,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Restore state</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
