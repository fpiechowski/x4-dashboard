/**
 * ArwesPanel — Reusable sci-fi panel wrapper using Arwes FrameLines
 * Wraps content in an Arwes-styled SVG frame with animated borders
 * and an optional typewriter-animated title.
 */
import React from 'react'
import { Animator, Animated, Text, FrameCorners } from '@arwes/react'

type PanelColor = 'primary' | 'danger' | 'success' | 'warning' | 'purple'

const COLOR_MAP: Record<PanelColor, { line: string; bg: string; filter: string }> = {
  primary: {
    line:   'hsl(191deg 100% 50%)',
    bg:     'hsl(191deg 100% 50% / 6%)',
    filter: 'drop-shadow(0 0 3px hsl(191deg 100% 50% / 60%))',
  },
  danger: {
    line:   'hsl(349deg 100% 55%)',
    bg:     'hsl(349deg 100% 55% / 8%)',
    filter: 'drop-shadow(0 0 4px hsl(349deg 100% 55% / 70%))',
  },
  success: {
    line:   'hsl(151deg 100% 45%)',
    bg:     'hsl(151deg 100% 45% / 6%)',
    filter: 'drop-shadow(0 0 3px hsl(151deg 100% 45% / 50%))',
  },
  warning: {
    line:   'hsl(26deg 100% 50%)',
    bg:     'hsl(26deg 100% 50% / 6%)',
    filter: 'drop-shadow(0 0 3px hsl(26deg 100% 50% / 50%))',
  },
  purple: {
    line:   'hsl(291deg 90% 70%)',
    bg:     'hsl(291deg 90% 70% / 6%)',
    filter: 'drop-shadow(0 0 3px hsl(291deg 90% 70% / 50%))',
  },
}

interface Props {
  title?: string
  titleIcon?: string
  color?: PanelColor
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export function ArwesPanel({
  title,
  titleIcon = '◈',
  color = 'primary',
  children,
  style,
  className,
}: Props) {
  const c = COLOR_MAP[color]

  return (
    <Animator>
      <Animated
        as="div"
        className={className}
        animated={['fade', ['y', 8, 0]]}
        style={{
          position: 'relative',
          padding: '12px',
          background: 'rgba(0, 10, 16, 0.92)',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {/* Arwes SVG frame border — absolutely fills the parent */}
        <FrameCorners
          style={{
            '--arwes-frames-line-color': c.line,
            '--arwes-frames-bg-color': c.bg,
            '--arwes-frames-line-filter': c.filter,
          } as React.CSSProperties}
          animated
          strokeWidth={1}
          cornerLength={14}
        />

        {/* Content sits on top of the SVG frame */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {title && (
            <Animator>
              <Text
                as="div"
                manager="sequence"
                fixed
                contentStyle={{
                  fontSize: '10px',
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  color: c.line,
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 600,
                }}
              >
                {`${titleIcon} ${title}`}
              </Text>
            </Animator>
          )}
          {children}
        </div>
      </Animated>
    </Animator>
  )
}
