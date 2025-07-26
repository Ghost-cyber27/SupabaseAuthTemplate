// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

// Define the parameter list for the authentication stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Define the parameter list for the authenticated app stack
export type AppStackParamList = {
  Profile: undefined;
  // Add other screens for your authenticated app here, e.g.,
  // Dashboard: undefined;
  // Settings: undefined;
};

// Define the root stack parameter list, which includes both Auth and App stacks
// NavigatorScreenParams allows nesting navigators and passing params to them
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};
