// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User } from '@supabase/supabase-js'; // Import User type

// Import your screens
import LoginScreen from '../screen/Login';
import SignupScreen from '../screen/Signup';
import ForgotPasswordScreen from '../screen/ForgotPassword';
import ProfileScreen from '../screen/Profile';

// Import navigation types
import { AuthStackParamList, AppStackParamList, RootStackParamList } from '../types/Navigator';

// Create stack navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>(); // Root stack to switch between Auth and App

interface AppNavigatorProps {
  session: User | null; // Pass the Supabase user session to determine which stack to show
}

/**
 * AuthStack component for unauthenticated users.
 */
const AuthStackNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

/**
 * AppStack component for authenticated users.
 */
const AppStackNavigator: React.FC = () => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      {/* Add other authenticated screens here */}
    </AppStack.Navigator>
  );
};

/**
 * Main AppNavigator that conditionally renders AuthStack or AppStack.
 * @param session - The Supabase user session.
 */
const AppNavigator: React.FC<AppNavigatorProps> = ({ session }) => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // User is authenticated, show the main app screens
          <RootStack.Screen name="App" component={AppStackNavigator} />
        ) : (
          // No user session, show the authentication screens
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
