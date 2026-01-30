# Next.js PWA Projects & Tasks

A production-ready Next.js 16+ PWA application with Projects and Tasks management.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **PWA**: [Serwist](https://serwist.pages.dev/)
- **Persistence**: Local JSON Storage (Clean Architecture)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (v10+)
- [Node.js](https://nodejs.org/) (v24+)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build & Start

```bash
pnpm build
pnpm start
```

### Linting & Formatting

```bash
pnpm check   # Lint, format, and check imports
pnpm format  # Format files
pnpm lint    # Lint files
```

### Testing

```bash
pnpm test
```

## Architecture Notes

For a detailed breakdown of the project structure, data flow, and technical decisions, please refer to our **[Architecture Documentation](file:///Users/filio/Work/DEVELOPMENT/NEXT/PWA/ARCHITECTURE.md)**.

### Persistence Choice
We use a file-based JSON storage implementation for persistence. This ensures the application is self-contained and works without external database services, while maintaining a clear separation between the domain logic and infrastructure.

### PWA Strategy
The application uses **Serwist** for PWA functionality. It includes:
- A custom service worker with stale-while-revalidate caching for assets.
- Offline fallback page (`/offline`).
- Update notification strategy.
- Web manifest for installability.
- **Turbopack Compatibility**: In Next.js 16, Serwist is disabled in development mode to ensure compatibility with Turbopack, while remaining fully active in production builds.

### Styling (Tailwind CSS v4)
This project uses the latest Tailwind CSS v4, which moves theme configuration into CSS. The `src/app/globals.css` file uses the `@theme` block for variable definitions, and the build pipeline uses `@tailwindcss/postcss` for optimal performance with Next.js Turbopack.

### Component Library
We use **shadcn/ui** (based on Radix UI) for accessible, unstyled primitives styled with Tailwind CSS. This allows for full control over the design while ensuring accessibility best practices.

### Zustand Usage
Zustand is used for client-side state management (UI state, optimistic updates). Server state is primarily handled via Next.js Route Handlers and standard fetch patterns.

### Biome
Biome is the sole tool for linting and formatting, providing a fast and integrated experience without the complexity of ESLint and Prettier.
