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

## 📱 Screenshots

<img width="1206" height="2622" alt="simulator_screenshot_BADF0023-23A1-4837-9E83-270B2B774CCE" src="https://github.com/user-attachments/assets/397ee11a-8c8a-41fe-98c2-e0cdf2f901a9" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 10 02 10" src="https://github.com/user-attachments/assets/c5b0eb97-de07-4370-9f61-3aabcb6f8a18" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 09 55 27" src="https://github.com/user-attachments/assets/21009885-e7c2-48ab-a722-add7cae7e812" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 10 02 10" src="h<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 10 06 34" src="https://github.com/user-attachments/assets/4b1f9e20-ef81-4a65-87db-821fd00ad69f" />
ttps://github.com/user-attachments/assets/c55c2584-42a0-4d6f-8ee5-a49439142cb6" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 09 55 50" src="https://github.com/user-attachments/assets/4acc9951-b60e-428a-9f59-331557190ab7" />
<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-07-22 at 09 55 43" src="https://github.com/user-attachments/assets/0826d415-a8ed-4a4b-8fea-c788345d06b9" />


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
