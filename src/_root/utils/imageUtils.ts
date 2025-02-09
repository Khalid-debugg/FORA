import type { Crop } from "react-image-crop";

export async function processImage(
  image: HTMLImageElement,
  crop: Crop,
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
  const imageType = image.src.startsWith("data:image/png")
    ? "image/png"
    : "image/jpeg";
  const fileExtension = imageType === "image/png" ? "png" : "jpg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], `cropped-image.${fileExtension}`, {
          type: imageType,
        });
        resolve(file);
      },
      imageType,
      imageType === "image/jpeg" ? 0.95 : undefined, // JPEG quality
    );
  });
}
