// Client-side storage utilities using API routes

// Resim yükle
export async function uploadCarImage(file: File, carId: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('carId', carId);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
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
    const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
