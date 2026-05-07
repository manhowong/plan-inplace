# File Tree (incomplete)

NOTE: The file tree is not complete.

```text
/
├── .vscode/                    # VS Code specific settings
├── apps/                       # Application entry points
│   ├── web/                    # React application (Web/PWA)
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Root component
│   │   ├── index.css           # Global styles
│   │   ├── manifest.webmanifest # PWA manifest
│   │   ├── vite-env.d.ts       # Vite types
│   │   ├── components/         # React components
│   │   │   ├── layout/         # Shared layouts
│   │   │   ├── modules/        # Feature modules
│   │   │   └── ui/             # UI Components (aliased to @packages/ui)
│   │   └── lib/                # App-specific logic
│   │       └── useHotkey.ts    # Keybinding hook
│   └── vscode/                 # VS Code extension source
│       ├── extension.ts        # Entry point
│       └── services/           # Extension services
├── assets/                     # Shared Brand assets
│   └── images/                 # Icons and logos
├── chrome/                     # Chrome Extension compatibility
│   └── manifest.json           # Chrome extension manifest
├── docs/                       # Project documentation
│   ├── DEVELOPER.md
│   └── FILES.md
├── packages/                   # Internal libraries (shared code)
│   ├── core/                   # Core business logic
│   │   ├── config.ts           # Shared configuration constants
│   │   └── logic.ts            # Core processing logic
│   ├── storage/                # Persistence and adapters
│   │   ├── adapters/           # Environment adapters
│   │   └── PlanContext.tsx     # State management
│   ├── types/                  # TypeScript interfaces
│   └── ui/                     # Atomic UI primitives
│       ├── constants.ts        # UI-specific constants (including OPTION_COLORS)
│       └── utils.ts            # UI helper functions
├── .gitignore                  # Git exclusion rules
├── .vscodeignore               # Files to exclude from VS Code extension bundle
├── index.html                  # Main entry point for the web application
├── metadata.json               # AI Studio project metadata
├── package.json                # Project dependencies and scripts
├── README.md                   # Primary project landing
├── tsconfig.json               # Main TypeScript configuration
└── vite.config.ts              # Vite build configuration
```
