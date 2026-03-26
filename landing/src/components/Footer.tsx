import { Animator, Animated, Text } from '@arwes/react'
import './Footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <Animator>
          <Animated
            as="div"
            className="footer-content"
            animated={['fade']}
          >
            <div className="footer-brand">
              <Text
                as="span"
                manager="sequence"
                fixed
                contentStyle={{
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  color: 'hsl(191deg 100% 50%)',
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                ◈ X4 DASHBOARD
              </Text>
              <Text
                as="p"
                manager="sequence"
                fixed
                contentStyle={{
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'hsl(200deg 20% 60%)',
                  fontFamily: "'Exo 2', sans-serif",
                  marginTop: '8px',
                }}
              >
                A browser-first cockpit HUD for X4: Foundations
              </Text>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <Text
                  as="h4"
                  manager="sequence"
                  fixed
                  contentStyle={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'hsl(200deg 20% 80%)',
                    fontFamily: "'Exo 2', sans-serif",
                    marginBottom: '16px',
                  }}
                >
                  Project
                </Text>
                <ul>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Releases
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/blob/master/docs/player-guide.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/blob/master/ROADMAP.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Roadmap
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <Text
                  as="h4"
                  manager="sequence"
                  fixed
                  contentStyle={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'hsl(200deg 20% 80%)',
                    fontFamily: "'Exo 2', sans-serif",
                    marginBottom: '16px',
                  }}
                >
                  Community
                </Text>
                <ul>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Issues
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/blob/master/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contributing
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <Text
                  as="h4"
                  manager="sequence"
                  fixed
                  contentStyle={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'hsl(200deg 20% 80%)',
                    fontFamily: "'Exo 2', sans-serif",
                    marginBottom: '16px',
                  }}
                >
                  Legal
                </Text>
                <ul>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/blob/master/LICENSE"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      License
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/fpiechowski/x4-dashboard/blob/master/SECURITY.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Animated>
        </Animator>

        <Animator>
          <Animated
            as="div"
            className="footer-bottom"
            animated={['fade']}
          >
            <Text
              as="p"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(200deg 20% 50%)',
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              © {currentYear} X4 Dashboard. MIT License. Built with React, Arwes, and passion for space sims.
            </Text>
            <Text
              as="p"
              manager="sequence"
              fixed
              contentStyle={{
                fontSize: '11px',
                fontWeight: 300,
                color: 'hsl(200deg 20% 40%)',
                fontFamily: "'Exo 2', sans-serif",
                marginTop: '8px',
              }}
            >
              X4: Foundations is a trademark of Egosoft GmbH. This project is not affiliated with Egosoft.
            </Text>
          </Animated>
        </Animator>
      </div>
    </footer>
  )
}
