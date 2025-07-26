// src/auth/supabase.ts
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto'; // Polyfill for URL API in React Native
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Requires installation: npm install @react-native-async-storage/async-storage

const supabaseUrl = 'https://bbapvahcrccpengadjnl.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYXB2YWhjcmNjcGVuZ2Fkam5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzkzNzUsImV4cCI6MjA2ODUxNTM3NX0.HJBlSHJR9lF6rvAUN2p5RmWVkAw9pKH6dDlBWB23ObA"
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase client initialized.');
// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
//₦