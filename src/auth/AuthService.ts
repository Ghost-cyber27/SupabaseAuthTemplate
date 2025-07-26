// src/auth/AuthService.ts
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js'; // Import User type for better typing

/**
 * Interface for the authentication service.
 * Defines the contract for authentication-related operations.
 */
interface IAuthService {
  signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }>;
  signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }>;
  signOut(): Promise<{ error: Error | null }>;
  passwordReset(email: string): Promise<{ error: Error | null }>;
  getCurrentUser(): Promise<{ user: User | null; error: Error | null }>;
  updateProfile(updates: { username?: string; website?: string; avatar_url?: string }): Promise<{ user: User | null; error: Error | null }>;
}

/**
 * AuthService class to handle all Supabase authentication operations.
 */
class AuthService implements IAuthService {
  /**
   * Registers a new user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the user data or an error.
   */
  async signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Signup error:', error.message);
        return { user: null, error };
      }
      console.log('User signed up:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Unexpected signup error:', error.message);
      return { user: null, error: new Error('An unexpected error occurred during signup.') };
    }
  }

  /**
   * Logs in an existing user with email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the user data or an error.
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign-in error:', error.message);
        return { user: null, error };
      }
      console.log('User signed in:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Unexpected sign-in error:', error.message);
      return { user: null, error: new Error('An unexpected error occurred during sign-in.') };
    }
  }

  /**
   * Logs out the current user.
   * @returns An object indicating success or an error.
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign-out error:', error.message);
        return { error };
      }
      console.log('User signed out.');
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign-out error:', error.message);
      return { error: new Error('An unexpected error occurred during sign-out.') };
    }
  }

  /**
   * Sends a password reset email to the specified email address.
   * Supabase will send an email with a link to reset the password.
   * You might need to configure a redirect URL in your Supabase project settings.
   * @param email - The email address to send the reset link to.
   * @returns An object indicating success or an error.
   */
  async passwordReset(email: string): Promise<{ error: Error | null }> {
    try {
      // For password reset, Supabase sends an email.
      // You can specify a redirectTo URL if you want to handle the reset within your app
      // after the user clicks the link in the email.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: 'your-app-scheme://reset-password' // Example for deep linking
      });
      if (error) {
        console.error('Password reset error:', error.message);
        return { error };
      }
      console.log('Password reset email sent to:', email);
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected password reset error:', error.message);
      return { error: new Error('An unexpected error occurred during password reset.') };
    }
  }

  /**
   * Gets the currently authenticated user.
   * @returns An object containing the user data or an error.
   */
  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Get current user error:', error.message);
        return { user: null, error };
      }
      return { user, error: null };
    } catch (error: any) {
      console.error('Unexpected get current user error:', error.message);
      return { user: null, error: new Error('An unexpected error occurred while fetching user.') };
    }
  }

  /**
   * Updates the user's profile information.
   * Note: Supabase's `updateUser` function updates the `auth.users` table.
   * If you have a separate `profiles` table, you'll need to update that separately.
   * For simplicity, this example updates the `auth.users` metadata.
   * For a full profile, you'd typically have a `profiles` table and use `supabase.from('profiles').update(...)`.
   * @param updates - An object containing the profile fields to update.
   * @returns An object containing the updated user data or an error.
   */
  async updateProfile(updates: { username?: string; website?: string; avatar_url?: string }): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser({ data: updates }); // Update user metadata
      if (error) {
        console.error('Update profile error:', error.message);
        return { user: null, error };
      }
      console.log('Profile updated successfully.');
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Unexpected update profile error:', error.message);
      return { user: null, error: new Error('An unexpected error occurred during profile update.') };
    }
  }
}

// Export a singleton instance of AuthService
export const authService = new AuthService();
