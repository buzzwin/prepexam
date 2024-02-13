import React, { useState, useEffect } from "react";

interface ImageEditorProps {
  initialImageUrl?: string;
  onImageReady?: (imageData: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  initialImageUrl,
  onImageReady,
}) => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [grayscale, setGrayscale] = useState(false); // State to toggle grayscale

  useEffect(() => {
    if (initialImageUrl) {
      setImageSrc(initialImageUrl);
    }
  }, [initialImageUrl]);

  const toggleGrayscale = () => {
    setGrayscale(!grayscale);
  };

  // Optionally, handle the "image ready" event, e.g., after editing
  useEffect(() => {
    if (onImageReady && imageSrc) {
      // This is a placeholder. You might want to process the image data further,
      // e.g., applying the grayscale filter not just visually but to the image data itself
      onImageReady(imageSrc.toString());
    }
  }, [imageSrc, onImageReady, grayscale]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {imageSrc && (
        <img
          src={imageSrc as string}
          alt="Editable"
          className={`max-w-xs ${grayscale ? "filter grayscale" : ""}`}
        />
      )}
      <button
        onClick={toggleGrayscale}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Toggle Grayscale
      </button>
      {/* Implement additional editing controls as needed */}
    </div>
  );
};

export default ImageEditor;
