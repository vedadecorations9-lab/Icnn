import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/admin-portal.css';
import { ConvexProvider } from 'convex/react';
import { convex } from './convexClient';
import { ClerkProvider } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

let content = convex ? (
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
) : (
  <App />
);

if (PUBLISHABLE_KEY) {
  content = (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {content}
    </ClerkProvider>
  );
}

const rootContent = (
  <React.StrictMode>
    {content}
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(rootContent);
