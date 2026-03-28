# X4 Dashboard Landing Page

A public landing page for the X4 Dashboard project, built with React, TypeScript, Vite, and the Arwes sci-fi UI framework.

## Overview

This landing page showcases the X4 Dashboard project with:

- **Hero Section** - Project introduction with animated HUD preview
- **Features Section** - Key capabilities and benefits
- **Screenshots Section** - Visual showcase of the dashboard
- **Download Section** - Links to releases, documentation, and source
- **Footer** - Project links and attribution

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Arwes** - Sci-fi UI components and animations
- **CSS** - Custom styling with CSS variables

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd landing
npm install
```

### Development Server

```bash
npm run dev
```

The dev server will start on `http://localhost:5173` (or another port if 5173 is in use).

### Build

```bash
npm run build
```

The production build will be output to `landing/dist/`.

### Type Checking

```bash
npm run typecheck
```

## Deployment

The landing page is deployed through Dokploy using `Dockerfile.landing`.

### Manual Deployment

1. Build the project: `npm run build`
2. Ensure Dokploy points the service at `Dockerfile.landing`
3. Use the resulting `landing/dist/` bundle or container image as the deployment artifact

## Design System

The landing page uses the same Arwes design system as the main dashboard:

- **Primary Color**: Cyan (`hsl(191deg 100% 50%)`)
- **Success Color**: Green (`hsl(151deg 100% 45%)`)
- **Warning Color**: Orange (`hsl(26deg 100% 50%)`)
- **Danger Color**: Red (`hsl(349deg 100% 55%)`)
- **Purple Accent**: (`hsl(291deg 90% 70%)`)

### Typography

- **Font Family**: Exo 2 (Google Fonts)
- **Headings**: Uppercase with letter-spacing
- **Body**: Light weight (300) for readability

### Components

- **FrameCorners** - Animated border frames from Arwes
- **Animator/Animated** - Entrance animations
- **Text** - Typewriter text effects

## File Structure

```
landing/
├── src/
│   ├── components/
│   │   ├── HeroSection.tsx       # Hero with CTA
│   │   ├── FeaturesSection.tsx   # Feature cards
│   │   ├── ScreenshotsSection.tsx # Screenshot gallery
│   │   ├── DownloadSection.tsx   # Download links
│   │   └── Footer.tsx            # Footer with links
│   ├── App.tsx                   # Main app component
│   ├── App.css                   # App-level styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── README.md                     # This file
```

## License

MIT - See the main project LICENSE file.
