/**
 * Client-side image compression utility.
 * Compresses images to WebP (fallback JPEG), max 1600px, target ≤350KB.
 */

const MAX_DIMENSION = 1600;
const TARGET_SIZE_BYTES = 350 * 1024; // 350KB
const MAX_SIZE_BYTES = 700 * 1024;    // 700KB hard limit
const INITIAL_QUALITY = 0.78;
const QUALITY_STEP = 0.05;
const MIN_QUALITY = 0.4;

/**
 * Read EXIF orientation from a File/Blob (simplified for iPhone photos).
 */
function getExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const view = new DataView(e.target?.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(1);
        return;
      }
      let offset = 2;
      while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xffe1) {
          if (view.getUint32(offset + 2, false) !== 0x45786966) {
            resolve(1);
            return;
          }
          const little = view.getUint16(offset + 8, false) === 0x4949;
          const tags = view.getUint16(offset + 14, little);
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + 16 + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + 16 + i * 12 + 8, little));
              return;
            }
          }
          resolve(1);
          return;
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(1);
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}

/**
 * Apply EXIF orientation transform to canvas context.
 */
function applyOrientation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: number
) {
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
  }
}

function supportsWebP(): boolean {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

/**
 * Compress an image file.
 * Returns a new File with compressed content.
 */
export async function compressImage(
  file: File,
  options?: { maxDimension?: number; targetBytes?: number }
): Promise<File> {
  const maxDim = options?.maxDimension ?? MAX_DIMENSION;
  const targetBytes = options?.targetBytes ?? TARGET_SIZE_BYTES;

  // If already small enough, return as-is
  if (file.size <= targetBytes && file.type === "image/webp") {
    return file;
  }

  const orientation = await getExifOrientation(file);
  const useWebP = supportsWebP();
  const mimeType = useWebP ? "image/webp" : "image/jpeg";
  const ext = useWebP ? "webp" : "jpg";

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Swap dimensions for rotated orientations
      const rotated = orientation >= 5 && orientation <= 8;

      // Scale down
      const scale = Math.min(1, maxDim / Math.max(width, height));
      let canvasW = Math.round(width * scale);
      let canvasH = Math.round(height * scale);

      if (rotated) {
        [canvasW, canvasH] = [canvasH, canvasW];
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d")!;

      if (orientation > 1) {
        applyOrientation(ctx, canvasW, canvasH, orientation);
      }

      if (rotated) {
        ctx.drawImage(img, 0, 0, canvasH, canvasW);
      } else {
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
      }

      // Progressive quality reduction
      let quality = INITIAL_QUALITY;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            if (blob.size <= targetBytes || quality <= MIN_QUALITY) {
              const originalKB = (file.size / 1024).toFixed(1);
              const finalKB = (blob.size / 1024).toFixed(1);
              console.log(
                `[image-compression] ${file.name}: ${originalKB}KB → ${finalKB}KB (q=${quality.toFixed(2)}, ${ext})`
              );

              if (blob.size > MAX_SIZE_BYTES) {
                console.warn(
                  `[image-compression] File still above ${MAX_SIZE_BYTES / 1024}KB hard limit`
                );
              }

              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, `.${ext}`),
                { type: mimeType }
              );
              resolve(compressedFile);
            } else {
              quality -= QUALITY_STEP;
              tryCompress();
            }
          },
          mimeType,
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
