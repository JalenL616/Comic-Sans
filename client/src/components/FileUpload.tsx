import { useState } from 'react';
import type { Comic } from '../types/comic';

const API_URL = import.meta.env.VITE_API_URL;

interface FileUploadProps {
  onComicFound: (comic: Comic) => void;
}

export function FileUpload({ onComicFound }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading file:', file.name);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('Comic found:', data);

      // Pass comic to parent (App.tsx) to add to grid
      onComicFound(data);

      // Reset the input so the same file can be uploaded again
      e.target.value = '';

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="file-upload">
      <label className="upload-button">
        {loading ? 'Scanning...' : 'Upload Barcode'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </label>
      {error && <span className="upload-error">{error}</span>}
    </div>
  );
}
