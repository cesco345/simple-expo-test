# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

# Port Scanner Refactoring

This directory contains the refactored port scanner functionality, broken down into smaller, maintainable files following clean code practices.

## Directory Structure

```
port-scanner/
├── _layout.tsx (existing)
├── index.tsx (main component ~150 lines)
├── README.md (this file)
├── components/
│   ├── NetworkInfo.tsx (~80 lines)
│   ├── ScanControls.tsx (~60 lines)
│   ├── ScanProgress.tsx (~50 lines)
│   ├── DebugLogs.tsx (~100 lines)
│   └── ResultsList.tsx (~150 lines)
├── hooks/
│   ├── useNetworkInfo.ts (~60 lines)
│   ├── usePortScanner.ts (~180 lines)
│   └── useDebugLogs.ts (~50 lines)
├── types/
│   └── index.ts (~30 lines)
├── constants/
│   ├── ports.ts (~50 lines)
│   └── vulnerabilities.ts (~80 lines)
└── utils/
    └── scanners.ts (~160 lines)
```

## Key Improvements

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusable Components**: UI components are decoupled and reusable
3. **Custom Hooks**: Business logic is encapsulated in hooks
4. **Type Safety**: All types are properly defined and exported
5. **Maintainability**: Each file is under 200 lines
6. **Testability**: Functions and components can be easily unit tested

## Migration Guide

To migrate from the old 912-line file:

1. Create the new directory structure
2. Copy each code block into its respective file
3. Update import paths in the main component
4. Remove the old index.tsx file

All functionality remains exactly the same - this is purely a structural refactoring.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
