const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const BARCODE_TIMEOUT_MS = 10000; // 10 seconds

export interface BarcodeResult {
  upc: string;
  extension: string | null;
}

export async function scanBarcode(imageBuffer: Buffer): Promise<BarcodeResult | null> {
  try {
    const formData = new FormData();

    // Convert Buffer to Uint8Array, then to Blob
    const uint8Array = new Uint8Array(imageBuffer);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    formData.append('image', blob, 'image.jpg');

    console.log('Sending image to Python service...');

    // Add timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BARCODE_TIMEOUT_MS);

    const response = await fetch(`${PYTHON_SERVICE_URL}/scan`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      console.error('Python service error:', error);
      return null;
    }

    const data = await response.json();
    console.log('UPC Scanned:', data.upc, 'Extension:', data.extension);

    return {
      upc: data.upc,
      extension: data.extension || null
    };

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Barcode service timeout');
    } else {
      console.error('Error calling barcode service:', error);
    }
    return null;
  }
}
