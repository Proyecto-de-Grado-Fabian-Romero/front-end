# Front End

This is the repository that contains the front end of Spacio Progressive Web Aplication.

### Project Structure

src/
├── app/ # Main folder of the App Router
│ ├── (group)/ # You can use route groups (optional)
│ ├── page.tsx # Main page
│ └── ... # Other pages and subdirectories of routes
│
├── components/ # Reusable application components
│ ├── Button.tsx # Example of a component
│ └── ... # Other components
│
├── styles/ # Global style files and MUI themes
│ ├── global.css # Global styles
│ ├── theme.ts # Material UI theme (theme configuration)
│ └── ... # Other styles
│
├── utils/ # Utility functions and helpers
│ ├── formatDate.ts # Example of a utility function
│ └── ... # Other helpers
│
├── config/ # Any Configuration File
│
├── types/ # TypeScript interfaces and types
│ ├── User.ts # Example of a user type or interface
│ └── ... # Other types and interfaces
│
├── hooks/ # Custom React hooks
│ ├── useAuth.ts # Example of a custom hook
│ └── ... # Other custom hooks
│
└── services/ # Services and business logic
│ ├── authService.ts # Authentication logic
└── ... # Other services

### Scripts:

- `ci-check`: Runs a series of checks including Prettier, linting, and TypeScript type checking to ensure code quality.
- `prettier:check`: Checks the code formatting using Prettier.
- `prettier:fix`: Fixes the code formatting issues using Prettier.
- `lint`: Runs the Next.js linter to check for code quality issues.
- `type-check`: Runs TypeScript type checking without emitting any output files.
