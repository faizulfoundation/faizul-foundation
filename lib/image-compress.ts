const MAX_DATA_URL_BYTES = 140_000;
const MAX_IMAGE_DIM = 900;

export interface ProcessedAttachment {
  name: string;
  mimeType: string;
  dataUrl: string;
}

export async function compressFileForFirestore(file: File): Promise<ProcessedAttachment> {
  if (file.type.startsWith('image/')) {
    const dataUrl = await compressImageToDataUrl(file, MAX_DATA_URL_BYTES);
    return {
      name: file.name.slice(0, 140),
      mimeType: 'image/jpeg',
      dataUrl,
    };
  }

  if (file.type === 'application/pdf') {
    if (file.size > 140_000) {
      throw new Error(
        'PDF file is too large (max 140 KB). Please compress the PDF or attach a clear photo instead.'
      );
    }
    const dataUrl = await readFileAsDataUrl(file);
    if (dataUrl.length > 340_000) {
      throw new Error('Encoded PDF exceeds secure upload size limit. Please upload an image instead.');
    }
    return {
      name: file.name.slice(0, 140),
      mimeType: 'application/pdf',
      dataUrl,
    };
  }

  throw new Error('Unsupported file format. Please upload an image (JPG, PNG, WebP) or compact PDF.');
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read selected file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read selected file.'));
    reader.readAsDataURL(file);
  });
}

async function compressImageToDataUrl(file: File, maxBytes: number): Promise<string> {
  const rawUrl = await readFileAsDataUrl(file);
  const img = await loadImage(rawUrl);

  const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(img.width, img.height));
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize image processor.');
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const qualities = [0.78, 0.64, 0.5, 0.38, 0.28];
  for (const quality of qualities) {
    const candidate = canvas.toDataURL('image/jpeg', quality);
    if (candidate.length <= maxBytes * 1.45) {
      return candidate;
    }
  }

  throw new Error('Image could not be compressed under secure cloud limits. Please choose a smaller image.');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode selected image.'));
    img.src = src;
  });
}

const PIN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateReferenceCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `FF-${hex}`;
}

export function generateTrackingPin(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => PIN_ALPHABET[b % PIN_ALPHABET.length])
    .join('');
}

export async function computeStatusLookupId(referenceCode: string, trackingPin: string): Promise<string> {
  const normalized = `${referenceCode.trim().toUpperCase()}:${trackingPin.trim().toUpperCase()}`;
  const encoded = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
