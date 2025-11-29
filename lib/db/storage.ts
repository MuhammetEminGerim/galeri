// Client-side storage utilities for cPanel (Static Export)
// Note: This uses unsigned Cloudinary uploads since we cannot use server-side API routes on static hosting.

export async function uploadCarImage(file: File, carId: string): Promise<string> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'; // Fallback or env var

    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name is missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `cars/${carId}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadMultipleImages(files: File[], carId: string): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadCarImage(file, carId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

// Note: Deleting images directly from client-side without a backend signature is risky/restricted in Cloudinary.
// For static sites, we usually just remove the reference from Firestore.
// If strict deletion is needed, it requires a backend function (e.g., Firebase Cloud Functions).
export async function deleteCarImage(imageUrl: string): Promise<void> {
  console.warn('Image deletion from storage is skipped for static export security. Reference removed from DB.');
  return Promise.resolve();
}
