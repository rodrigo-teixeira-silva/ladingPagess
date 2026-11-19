import type { CompressedImage } from "@/types/course";

const DEFAULT_MAX_WIDTH = 1280;
// Documento do Firestore tem limite de 1 MiB; deixa margem para os demais campos.
const MAX_BASE64_LENGTH = 900_000;
const QUALITIES = [0.85, 0.75, 0.65, 0.55];

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível processar a imagem."))),
      type,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(blob);
  });
}

/** Redimensiona e comprime a imagem no navegador (WebP, ou JPEG quando o navegador não gera WebP). */
export async function compressImage(file: File, maxWidth = DEFAULT_MAX_WIDTH): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG ou WebP.");
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível processar a imagem.");

    let width = Math.min(maxWidth, bitmap.width);
    for (let attempt = 0; attempt < 5; attempt++) {
      canvas.width = width;
      canvas.height = Math.max(1, Math.round((bitmap.height * width) / bitmap.width));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of QUALITIES) {
        let blob = await canvasToBlob(canvas, "image/webp", quality);
        if (blob.type !== "image/webp") blob = await canvasToBlob(canvas, "image/jpeg", quality);
        const dataUrl = await blobToDataUrl(blob);
        const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
        if (base64.length <= MAX_BASE64_LENGTH) {
          return { base64, contentType: blob.type, previewUrl: dataUrl };
        }
      }
      width = Math.round(width * 0.8);
    }
    throw new Error("A imagem continua grande demais mesmo após a compressão.");
  } finally {
    bitmap.close();
  }
}
