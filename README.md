# React User Search App

A React application that provides an auto-complete search for users from the JSONPlaceholder API and displays their name and address information according to specific formatting requirements.

## Features

- Auto-complete search using Material UI components
- User names displayed in format: "{Last Name} {Suffix}, {First Name} (Title)"
- Results sorted alphabetically by last name
- Display of user address details
- Avatar generation based on user names
- Responsive design
- Dark mode support with theme toggle

## Technologies

- React with TypeScript
- Material UI components
- Fetch API for data retrieval
- Jest for testing
- Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js v20 or later
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/jeromehardaway/react-user-search.git
   cd react-user-search
   ```

1. Install dependencies

   ```bash
   npm install
   ```

1. Running the application

   ```bash
   # Option 1: Development server with hot reloading
   npm run dev
   
   # Option 2: Build and preview the application
   npm run build && npm run preview
   
   # Access the application at the URL shown in the terminal
   # (typically http://localhost:5173 for dev or http://localhost:4173 for preview)
   ```

1. Run tests

   ```bash
   npm test
   ```

## Implementation Details

- User data is fetched from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users)
- Name formatting handles various cases:
  - "Jane Doe" → "Doe, Jane"
  - "Mr. John Doe Jr." → "Doe Jr., John (Mr.)"
  - "Mr. James Von Doe III" → "Von Doe III, James (Mr.)"
- Custom avatar generation with user initials and consistent colors

## Project Structure

```text
src/
├── assets/         # Static assets
├── components/     # React components
│   └── UserSearch.tsx
├── hooks/          # Custom React hooks
│   ├── useDebounce.ts
│   └── useUsers.ts
├── types/          # TypeScript type definitions
│   └── User.ts
├── utils/          # Utility functions
│   └── userUtils.ts
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```

## Future Improvements

- Implement favorite users functionality
- Add filtering by company or location
