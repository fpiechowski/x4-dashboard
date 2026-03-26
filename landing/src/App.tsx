import { Animator, Animated, Text } from '@arwes/react'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { ScreenshotsSection } from './components/ScreenshotsSection'
import { DownloadSection } from './components/DownloadSection'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Animator combine>
        <Animated
          as="div"
          className="app-background"
          animated={['fade']}
        >
          <div className="stars-bg" />
        </Animated>
      </Animator>

      <header className="app-header">
        <Animator>
          <Animated
            as="div"
            className="header-content"
            animated={['fade', ['y', -20, 0]]}
          >
            <div className="logo">
              <Text
                as="span"
                manager="sequence"
                fixed
                contentStyle={{
                  fontSize: '24px',
                  fontWeight: 700,
                  letterSpacing: '4px',
                  color: 'hsl(191deg 100% 50%)',
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                ◈ X4 DASHBOARD
              </Text>
            </div>
            <nav className="header-nav">
              <a href="#features">Features</a>
              <a href="#screenshots">Screenshots</a>
              <a href="#download">Download</a>
              <a
                href="https://github.com/fpiechowski/x4-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub
              </a>
            </nav>
          </Animated>
        </Animator>
      </header>

      <main className="app-main">
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <DownloadSection />
      </main>

      <Footer />
    </div>
  )
}

export default App
