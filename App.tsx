// App.tsx
import 'react-native-url-polyfill/auto'; // IMPORTANT: Polyfill for URL API in React Native
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Alert } from 'react-native';
import { User } from '@supabase/supabase-js';

import { supabase } from './src/auth/supabase'; // Import the Supabase client
import AppNavigator from './src/navigation/AppNavigator'; // Import your App Navigator
import LoadingIndicator from './src/component/LoadingIndicator'; // Import loading indicator

export default function App() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      setSession(session?.user || null); // Update session state
      setLoading(false); // Authentication state has been checked
    });

    // Initial check for session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting initial session:', error.message);
        Alert.alert('Session Error', error.message);
      }
      setSession(session?.user || null);
      setLoading(false);
    };

    getInitialSession();

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator isLoading={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Pass the session to the AppNavigator to determine which stack to render */}
      <AppNavigator session={session} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
