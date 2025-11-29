import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Resim yükle
export async function uploadCarImage(file: File, carId: string): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${random}.${extension}`;

    // Create a reference to the file location
    const storageRef = ref(storage, `cars/${carId}/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Çoklu resim yükle
export async function uploadMultipleImages(files: File[], carId: string): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadCarImage(file, carId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

// Resim sil
export async function deleteCarImage(imageUrl: string): Promise<void> {
  try {
    // Create a reference from the URL
    const storageRef = ref(storage, imageUrl);

    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
