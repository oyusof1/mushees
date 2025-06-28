import { ClerkProvider } from '@clerk/clerk-react';

// You'll need to get this from your Clerk dashboard
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'your-clerk-publishable-key-here';

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
} 