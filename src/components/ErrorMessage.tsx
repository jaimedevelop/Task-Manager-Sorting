import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 font-medium">Connection Error</p>
          <p className="text-red-700 text-sm mt-1">{message}</p>
          {message.includes('permission-denied') && (
            <div className="mt-3 p-3 bg-red-100 rounded-lg">
              <p className="text-red-800 text-sm font-medium mb-2">Firestore Security Rules Issue</p>
              <p className="text-red-700 text-xs">
                Your Firestore database has security rules that are blocking access. 
                Please update your Firestore security rules to allow read/write operations.
              </p>
              <div className="mt-2 p-2 bg-red-200 rounded text-xs font-mono text-red-900">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </div>
              <p className="text-red-700 text-xs mt-2">
                Go to Firebase Console → Firestore Database → Rules and replace the existing rules with the above.
              </p>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}