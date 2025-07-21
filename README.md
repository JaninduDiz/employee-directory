# Employee Directory

A modern React Native employee management application built with Expo, featuring authentication, CRUD operations, search functionality, and a clean, intuitive user interface.

## 🚀 Features

### Core Functionality

- **Employee Management**: Create, read, update, and delete employee records
- **Smart Search**: Real-time search by name, age, and employee ID with debounced queries
- **Sectioned Lists**: Alphabetically organized employee directory with sticky headers
- **Swipe to Delete**: Intuitive gesture-based deletion with smooth animations
- **Form Validation**: Comprehensive input validation with real-time error feedback

### User Experience

- **Authentication**: Secure login system with persistent sessions
- **Modal Presentations**: Clean, focused add/edit employee screens
- **Header Navigation**: Action buttons conveniently placed in navigation headers
- **Theme Support**: Dark and light theme compatibility
- **Responsive Design**: Optimized for both iOS and Android platforms

### Technical Features

- **Persistent Storage**: AsyncStorage for offline data persistence
- **State Management**: Zustand for efficient global state handling
- **TypeScript**: Full type safety throughout the application
- **Gesture Handling**: PanResponder for smooth swipe interactions
- **Form Management**: Advanced form handling with auto-generation features

## 📱 Screenshots

_Add screenshots here showcasing the main features_

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Styling**: StyleSheet with custom theming
- **Animations**: React Native Reanimated 3
- **Icons**: Expo Vector Icons (Ionicons)
- **Gestures**: React Native PanResponder

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Package manager
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)
- **Expo Go app** (for physical device testing)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JaninduDiz/employee-directory.git
cd employee-directory
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npx expo start
# or
yarn expo start
```

### 4. Run on Device/Simulator

#### Option A: Physical Device

1. Install **Expo Go** from App Store (iOS) or Google Play Store (Android)
2. Scan the QR code displayed in terminal with your device camera
3. The app will open in Expo Go

#### Option B: iOS Simulator (macOS only)

```bash
npx expo start --ios
```

#### Option C: Android Emulator

```bash
npx expo start --android
```

#### Option D: Web Browser

```bash
npx expo start --web
```

## 📁 Project Structure

```
employee-directory/
├── app/
│   ├── (auth)/                 # Authentication screens
│   │   ├── _layout.tsx         # Auth layout wrapper
│   │   └── index.tsx           # Login screen
│   ├── (main)/                 # Main application screens
│   │   ├── _layout.tsx         # Main layout with navigation
│   │   ├── index.tsx           # Employee directory (home)
│   │   ├── add-employee.tsx    # Add new employee
│   │   └── edit-employee.tsx   # Edit existing employee
│   ├── _layout.tsx             # Root layout
│   ├── +html.tsx               # Web HTML template
│   ├── +not-found.tsx          # 404 page
│   └── index.tsx               # App entry point
├── components/
│   ├── DatePicker.tsx          # Custom date picker component
│   ├── EditEmployeeForm.tsx    # Reusable employee form
│   ├── EmployeeDetailModal.tsx # Employee details modal
│   ├── EmployeeItem.tsx        # Individual employee list item
│   ├── EmployeeList.tsx        # Main employee list component
│   ├── QuoteCard.tsx           # Motivational quote display
│   ├── SearchBox.tsx           # Search input component
│   └── useClientOnlyValue.ts   # Client-side rendering utilities
├── constants/
│   ├── Colors.ts               # Theme color definitions
│   ├── EmployeeList.ts         # Employee-related constants
│   └── index.ts                # Consolidated exports
├── hooks/
│   └── useTheme.ts             # Theme management hook
├── services/
│   ├── authService.ts          # Authentication API service
│   ├── employeeService.ts      # Employee CRUD operations
│   └── quoteApiService.ts      # External quote API integration
├── store/
│   ├── employeeStore.ts        # Employee state management
│   └── useAuthStore.ts         # Authentication state
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   └── validation.ts           # Form validation utilities
└── assets/                     # Static assets (fonts, images)
```

### Code Quality

- Follow TypeScript best practices
- Use consistent naming conventions
- Implement proper error handling
- Add appropriate loading states

## 📋 Key Features Explained

### Authentication System

- Persistent login sessions using AsyncStorage
- Secure logout with state cleanup
- Protected routes with automatic redirection
