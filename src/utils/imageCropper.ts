/**
 * Image Cropping Utility
 * Automatically center-crops any image to an exact 1:1 square (standard album artwork ratio)
 * using HTML5 Canvas with high-quality bicubic smoothing.
 */

export function autoCropSquareImage(file: File, targetSize: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas 2D rendering context'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          const srcW = img.naturalWidth || img.width;
          const srcH = img.naturalHeight || img.height;

          // Determine square bounding box centered in the source image
          const cropDim = Math.min(srcW, srcH);
          const cropX = (srcW - cropDim) / 2;
          const cropY = (srcH - cropDim) / 2;

          // Draw the cropped square onto the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropDim,
            cropDim,
            0,
            0,
            targetSize,
            targetSize
          );

          // Export as compressed high quality JPEG (quality 0.92)
          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve(croppedDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to decode image data'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
