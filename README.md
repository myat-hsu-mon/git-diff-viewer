## 📦 Installation

### Prerequisites

- Node.js 20.0.0 or higher
- npm 8.0.0 or higher

### Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:myat-hsu-mon/git-diff-viewer.git
   cd git-diff-viewer
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors

# Testing
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
```

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/               # Reusable UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── services/             # Business logic and data layer
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── test/                 # Test setup and utilities
└── features/             # Feature-specific modules
│   ├── main-diff-viewer/             # Main Diff Viewer feature
│      ├── pages/                     # pages
│      ├── components/                # components
│      ├── hooks/                     # hooks
│      ├── types/                     # types
│      ├── utils/                     # utils
│      ├── pages/                     # pages
│      ├── contexts/                  # contexts
│      ├── services/                  # services
│   ├── branches/                     # Branches feature
│   ├── repositories/                 # Repositories feature
```

## 🚀 Deployment

### Production Build

```bash
yarn build
```

### Project Link

```bash
https://git-diff-viewer-nkej.vercel.app/
```

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Conventional Commits** for commit messages
