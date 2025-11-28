/**
 * Compresses an image file by resizing it and reducing quality.
 * @param file The original image file
 * @param maxWidth The maximum width of the output image (default: 1920px)
 * @param quality The quality of the output image (0 to 1, default: 0.8)
 * @returns A Promise that resolves to the compressed File
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        // If it's not an image, return original
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not compress image'));
                            return;
                        }

                        // Create new file from blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg', // Convert to JPEG for better compression
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
}
