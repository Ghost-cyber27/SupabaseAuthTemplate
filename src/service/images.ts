import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { supabase } from "../auth/supabase";
import {decode} from 'base64-arraybuffer';
import { Alert } from "react-native";

const pickOneImage = async (): Promise<ImagePickerAsset | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== 'granted'){
      alert("Sorry, we need camera roll persmission to make this work!")
      return null;
    }
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      console.log(result);
      
      if (result.canceled) {
        console.log('Image picker canceled');

        return null;
      }
      if (result.assets && result.assets.length > 0) {
        console.log('Successful picked an image');
        return result.assets[0];
      } else {
        console.log('No asset found');
        return null;
      }
    } catch (error) {
      console.error(error)
      alert('An Error Occurred while picking an image')
      return null;
    }
};


const pickMultiImage = async (): Promise<ImagePickerAsset[]> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !== 'granted'){
      alert("Sorry, we need camera roll persmission to make this work!")
      return[];
    }
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsMultipleSelection: true,
        selectionLimit: 4
      });

      if (result.canceled) {
        console.log('Image picker canceled');
        return [];
      }
      if (result.assets && result.assets.length > 0) {
        console.log('Successful picked an image');
        return result.assets;
      } else {
        console.log('No asset found');
        return [];
      }
      
      } catch (error) {
        console.error(error);
        alert('An Error Occurred while picking the images')
        return[]
      }
    
};


const uploadImage = async (
    asset: ImagePickerAsset
): Promise<string | null> => {
    if (!asset.base64) {
        Alert.alert('Error', 'Image ${asset.fileName || selected image} deos not have base64 data');
        return null;
    }
    const title = 'image.jpg'
    const fileName = Date.now()+'.jpg';
    const fileExt = asset.uri.split('.').pop()?.toLowerCase();
    const fileMime = asset.type;

    try {
        const { error } = await supabase.storage
        .from("images")
        .upload(fileName, decode(asset.base64), {
            contentType: fileMime,
            upsert: false,
        });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

        return publicUrlData.publicUrl;

    } catch (error: any) {
        console.error('Error uploading image to storage: ', fileName, error);
        return null;
    }

}

const uploadMultipleImages = async (
    assets: ImagePickerAsset[]
): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for(const asset of assets){
        const url = await uploadImage(asset);
        if (url) {
            uploadedUrls.push(url);
        }
    }
    return uploadedUrls;
}

export {pickMultiImage, uploadMultipleImages}