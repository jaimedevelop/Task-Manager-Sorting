# Task Manager Application

A beautiful, production-ready task management application built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- ✅ Create, edit, and delete tasks
- 🎯 Priority levels (High, Medium, Low)
- 📊 Task statistics and filtering
- 🔍 Search functionality
- 🎲 Task raffle feature with sophisticated algorithms
- 📱 Fully responsive design
- 🔄 Real-time updates with Firebase

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Create a `.env` file in the root directory (copy from `.env.example`)
5. Fill in your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Update your Firestore security rules to allow read/write operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Run the Application

```bash
npm run dev
```

## Deployment

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard under Site Settings > Environment Variables

### Environment Variables for Production

Make sure to add all the Firebase environment variables to your deployment platform:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Technologies Used

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Database
- **Vite** - Build Tool
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Firebase configuration
├── services/           # API services
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Security Notes

- Firebase configuration is stored in environment variables
- Never commit `.env` files to version control
- Use Firestore security rules for production
- API keys are safe to expose in frontend applications (Firebase design)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request