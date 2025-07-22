# Employee Directory

A React Native employee management app built with Expo. Manage employees with CRUD operations, search functionality, and an intuitive interface.

## Features

- **Employee Management**: Add, view, edit, and delete employee records
- **Search**: Find employees by name, age, or employee ID
- **Swipe to Delete**: Delete employees with gesture controls
- **Form Validation**: Real-time input validation with helpful error messages
- **Auto-generated IDs**: Employee IDs automatically created with EMP\_ prefix
- **Authentication**: Secure login with session persistence

## Tech Stack

- React Native + Expo
- TypeScript
- Expo Router (navigation)
- Zustand (state management)
- AsyncStorage (local data)
- React Native Reanimated (animations)

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`

### Installation

```bash
git clone https://github.com/JaninduDiz/employee-directory.git
cd employee-directory
npm install
npx expo start
```

### Run the App

- **Phone**: Install Expo Go app and scan the QR code
- **iOS Simulator**: `npx expo start --ios`
- **Android Emulator**: `npx expo start --android`
- **Web Browser**: `npx expo start --web`

## Project Structure

```
app/
├── (auth)/          # Login screen
├── (main)/          # Main app screens
│   ├── index.tsx    # Employee list
│   ├── add-employee.tsx
│   └── edit-employee.tsx
components/          # Reusable UI components
services/           # API and data services
store/              # State management
types/              # TypeScript definitions
utils/              # Helper functions
```

## Key Features

### Employee Management

- Create new employees with form validation
- Edit existing employee information
- Delete employees with swipe gesture
- Auto-generated employee IDs (EMP_001, EMP_002, etc.)

### Search & Navigation

- Real-time search across name, age, and employee ID
- Alphabetically sorted employee list with section headers
- Modal screens for adding/editing employees

### Data & Authentication

- Local data storage with AsyncStorage
- Persistent login sessions
- Form validation with real-time feedback

## Development

The app uses:

- **File-based routing** with Expo Router
- **Global state** managed by Zustand stores
- **TypeScript** for type safety
- **Custom hooks** for theme and data management

For development, all employee data is stored locally. The app includes sample data generation for testing.
