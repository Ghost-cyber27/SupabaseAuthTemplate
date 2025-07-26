// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from '@supabase/supabase-js';
import { authService } from '../auth/AuthService';
import LoadingIndicator from '../component/LoadingIndicator';
import { AppStackParamList } from '../types/Navigator'; // Import navigation types
import { pickMultiImage, uploadMultipleImages } from '../service/images';
import { ImagePickerAsset } from 'expo-image-picker';

type ProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePickerAsset[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  /*const pickImage = async () => {
    const images = await pickMultiImage();
    setImage(images);
    //console.log(image);
    alert('Four Images have been loaded');
  };*/

  /*const handleImageUpload = async () => {
      if (image.length === 0) {
        Alert.alert(" No Images", "Please select images first");
        return;
      }
  
      try {
        const uploadedUrls = await uploadMultipleImages(image);
        if (!uploadedUrls || uploadedUrls.length === 0) {
          Alert.alert("Upload Failed", "No images were uploaded. Please try again.");
          return; // Stop here if image upload failed
        }
        Alert.alert("Upload Success", "All images uploaded.");
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload Error", "An error occurred during upload. Please try again later.");
      } finally {
        console.error("Upload tried");
      }    
  
    };*/

  /**
   * Fetches the current user's data from Supabase.
   */
  const fetchUserData = async () => {
    setLoading(true);
    const { user: currentUser, error } = await authService.getCurrentUser();
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (currentUser) {
      setUser(currentUser);
      // Supabase stores additional user data in the 'user_metadata' field
      setUsername(currentUser.user_metadata?.username || '');
      setWebsite(currentUser.user_metadata?.website || '');
    }
  };

  /**
   * Handles updating the user's profile information.
   * Calls the AuthService to update the user's metadata.
   */
  const handleUpdateProfile = async () => {
    setLoading(true);
    const { error } = await authService.updateProfile({ username, website });
    setLoading(false);

    if (error) {
      Alert.alert('Update Error', error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
      fetchUserData(); // Re-fetch user data to reflect changes
    }
  };

  /**
   * Handles logging out the current user.
   * Calls the AuthService to sign out the user.
   */
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await authService.signOut();
    setLoading(false);

    if (error) {
      Alert.alert('Logout Error', error.message);
    } else {
      // Navigation will be handled by the App.tsx's auth state listener
      Alert.alert('Success', 'Logged out successfully!');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={user.email || ''}
        editable={false} // Email is usually not editable directly here
      />
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Website:</Text>
      <TextInput
        style={styles.input}
        placeholder="Your website URL"
        value={website}
        onChangeText={setWebsite}
        keyboardType="url"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      {/*<TouchableOpacity style={styles.button} onPress={pickImage} disabled={loading}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleImageUpload} disabled={loading}>
        <Text style={styles.buttonText}>Upload Images</Text>
      </TouchableOpacity>*/}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout} disabled={loading}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <LoadingIndicator isLoading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // Red for logout
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default ProfileScreen;
