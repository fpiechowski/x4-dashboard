import React from 'react'
import { Animator, Animated, Text, FrameCorners } from '@arwes/react'
import './DownloadSection.css'

export function DownloadSection() {
  return (
    <section className="download-section" id="download">
      <div className="download-container">
        <Animator>
          <Animated
            as="div"
            className="section-header"
            animated={['fade', ['y', 20, 0]]}
          >
            <Text
              as="span"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'hsl(191deg 100% 50%)',
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 500,
              }}
            >
              ◈ GET STARTED
            </Text>
            <Text
              as="h2"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: 'clamp(28px, 5vw, 40px)',
                fontWeight: 700,
                letterSpacing: '1px',
                color: 'hsl(200deg 20% 95%)',
                fontFamily: "'Exo 2', sans-serif",
                marginTop: '16px',
              }}
            >
              Ready to Launch?
            </Text>
            <Text
              as="p"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: '16px',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'hsl(200deg 20% 70%)',
                fontFamily: "'Exo 2', sans-serif",
                marginTop: '16px',
                maxWidth: '600px',
              }}
            >
              Download the latest release and transform your X4 experience with a proper cockpit HUD.
            </Text>
          </Animated>
        </Animator>

        <div className="download-options">
          <Animator>
            <Animated
              as="div"
              className="download-card primary"
              animated={['fade', ['y', 20, 0]]}
            >
              <FrameCorners
                style={{
                  '--arwes-frames-line-color': 'hsl(191deg 100% 50%)',
                  '--arwes-frames-bg-color': 'hsl(191deg 100% 50% / 8%)',
                  '--arwes-frames-line-filter': 'drop-shadow(0 0 12px hsl(191deg 100% 50% / 50%))',
                } as React.CSSProperties}
                animated
                strokeWidth={2}
                cornerLength={20}
              />
              <div className="download-card-content">
                <div className="download-icon">◈</div>
                <Text
                  as="h3"
                  manager="sequence"
                  fixed
                  contentStyle={{
                    fontSize: '20px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: 'hsl(200deg 20% 95%)',
                    fontFamily: "'Exo 2', sans-serif",
                    marginBottom: '8px',
                  }}
                >
                  Latest Release
                </Text>
                <Text
                  as="p"
                  manager="sequence"
                  fixed
                  contentStyle={{
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    color: 'hsl(200deg 20% 65%)',
                    fontFamily: "'Exo 2', sans-serif",
                    marginBottom: '24px',
                  }}
                >
                  Get the newest version with all features and bug fixes
                </Text>
                <a
                  href="https://github.com/fpiechowski/x4-dashboard/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-button"
                >
                  <Text
                    as="span"
                    manager="sequence"
                    fixed
                    contentStyle={{
                      fontSize: '14px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    Download Now
                  </Text>
                </a>
              </div>
            </Animated>
          </Animator>

          <div className="download-secondary">
            <Animator>
              <Animated
                as="div"
                className="download-card secondary"
                animated={['fade', ['y', 20, 0]]}
                style={{ animationDelay: '0.1s' }}
              >
                <FrameCorners
                  style={{
                    '--arwes-frames-line-color': 'hsl(200deg 20% 40%)',
                    '--arwes-frames-bg-color': 'hsl(200deg 20% 20% / 20%)',
                    '--arwes-frames-line-filter': 'drop-shadow(0 0 4px hsl(200deg 20% 40% / 30%))',
                  } as React.CSSProperties}
                  animated
                  strokeWidth={1}
                  cornerLength={12}
                />
                <div className="download-card-content">
                  <Text
                    as="h4"
                    manager="sequence"
                    fixed
                    contentStyle={{
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      color: 'hsl(200deg 20% 90%)',
                      fontFamily: "'Exo 2', sans-serif",
                      marginBottom: '8px',
                    }}
                  >
                    Player Guide
                  </Text>
                  <Text
                    as="p"
                    manager="sequence"
                    fixed
                    contentStyle={{
                      fontSize: '13px',
                      fontWeight: 300,
                      lineHeight: 1.5,
                      color: 'hsl(200deg 20% 60%)',
                      fontFamily: "'Exo 2', sans-serif",
                      marginBottom: '16px',
                    }}
                  >
                    Step-by-step setup instructions for players
                  </Text>
                  <a
                    href="https://github.com/fpiechowski/x4-dashboard/blob/master/docs/player-guide.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    Read Guide →
                  </a>
                </div>
              </Animated>
            </Animator>

            <Animator>
              <Animated
                as="div"
                className="download-card secondary"
                animated={['fade', ['y', 20, 0]]}
                style={{ animationDelay: '0.2s' }}
              >
                <FrameCorners
                  style={{
                    '--arwes-frames-line-color': 'hsl(200deg 20% 40%)',
                    '--arwes-frames-bg-color': 'hsl(200deg 20% 20% / 20%)',
                    '--arwes-frames-line-filter': 'drop-shadow(0 0 4px hsl(200deg 20% 40% / 30%))',
                  } as React.CSSProperties}
                  animated
                  strokeWidth={1}
                  cornerLength={12}
                />
                <div className="download-card-content">
                  <Text
                    as="h4"
                    manager="sequence"
                    fixed
                    contentStyle={{
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      color: 'hsl(200deg 20% 90%)',
                      fontFamily: "'Exo 2', sans-serif",
                      marginBottom: '8px',
                    }}
                  >
                    Source Code
                  </Text>
                  <Text
                    as="p"
                    manager="sequence"
                    fixed
                    contentStyle={{
                      fontSize: '13px',
                      fontWeight: 300,
                      lineHeight: 1.5,
                      color: 'hsl(200deg 20% 60%)',
                      fontFamily: "'Exo 2', sans-serif",
                      marginBottom: '16px',
                    }}
                  >
                    Clone the repository and run from source
                  </Text>
                  <a
                    href="https://github.com/fpiechowski/x4-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    View on GitHub →
                  </a>
                </div>
              </Animated>
            </Animator>
          </div>
        </div>

        <Animator>
          <Animated
            as="div"
            className="download-note"
            animated={['fade']}
            style={{ animationDelay: '0.3s' }}
          >
            <Text
              as="p"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: '13px',
                fontWeight: 300,
                lineHeight: 1.5,
                color: 'hsl(200deg 20% 50%)',
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              Requires X4: Foundations with the Lua bridge mod installed.
              See the player guide for complete setup instructions.
            </Text>
          </Animated>
        </Animator>
      </div>
    </section>
  )
}
