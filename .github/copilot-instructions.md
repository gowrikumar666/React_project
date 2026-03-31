# React + TypeScript + Vite Project

A modern React application built with Vite for fast development and optimized builds.

## Project Features
- React 18+ with TypeScript
- Vite for rapid development and optimized builds
- ESLint for code quality
- Hot Module Replacement (HMR) for instant updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
Dependencies have already been installed. To run:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure
```
src/
  ├── App.tsx       # Main application component
  ├── App.css       # App styles
  ├── main.tsx      # Entry point
  └── index.css     # Global styles
public/            # Static assets
index.html         # HTML template
vite.config.ts     # Vite configuration
tsconfig.json      # TypeScript configuration
```

## Development Tips
- Edit files in `src/` and see changes instantly with HMR
- Use TypeScript for type safety
- Run `npm run lint` to check code quality

## Build for Production
```bash
npm run build
npm run preview
```

The production build will be in the `dist/` directory.
