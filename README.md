# Mimir - Smart TV Control Hub

Mimir is a comprehensive solution for discovering and controlling Smart TVs over the local network. This monorepo allows you to run a backend server that handles device discovery (via SSDP) and control protocols, along with a modern web frontend for user interaction.

## 🚀 Features

- **Device Discovery**: Automatically finds compatible Smart TVs on your local network using SSDP.
- **Remote Control**: standardized API to control various TV functions (Power, Volume, Channels, Input, etc.).
- **Modern UI**: A sleek, responsive web interface built with Angular and Tailwind CSS.
- **API Documentation**: Integrated Swagger/OpenAPI documentation for the backend endpoints.
- **Modular Architecture**: Built as a monorepo for better code organization and sharing.

## 🛠️ Tech Stack

### Monorepo & Tools

- **Package Manager**: [PNPM](https://pnpm.io/) (Workspaces)
- **Linter**: ESLint
- **Formatter**: Prettier
- **Versioning**: Semantic Release
- **Git Hooks**: Husky & Commitlint

### Frontend (`packages/mimir-app`)

- **Framework**: [Angular](https://angular.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State/Async**: RxJS

### Backend (`packages/mimir-server`)

- **Runtime**: Node.js
- **Framework**: [Express](https://expressjs.com/)
- **Language**: TypeScript
- **Discovery**: `node-ssdp`
- **Documentation**: Swagger UI

### Shared (`packages/shared`)

- Common TypeScript interfaces, types, and utility functions used by both the app and server.

## 📋 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.0.0 or higher)
- [PNPM](https://pnpm.io/installation)

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ramiz4/mimir.git
cd mimir
pnpm install
```

## 💻 Usage

### Development

To start the development environment for both the server and the application concurrently:

```bash
pnpm dev
```

This will start:

- **Server**: http://localhost:3000 (default)
- **Web App**: http://localhost:4200 (default)

You can also run them individually:

```bash
# Start only the backend server
pnpm dev:server

# Start only the frontend application
pnpm dev:app
```

### Building

To build the projects for production:

```bash
# Build the backend server
pnpm build:server

# Build the frontend application
pnpm build:app
```

### Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format all files
pnpm format
```

## 📂 Project Structure

```
├── packages
│   ├── mimir-app      # Angular frontend application
│   ├── mimir-server   # Node.js/Express backend server
│   └── shared         # Shared TypeScript code and types
├── .github            # GitHub Actions workflows
├── package.json       # Root package configuration
└── pnpm-workspace.yaml # PNPM workspace configuration
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
    - Note: This project uses **Commitlint**. Please follow [Conventional Commits](https://www.conventionalcommits.org/).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
