import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { X, Upload, Loader2, Link, ImageIcon } from 'lucide-react';
import { uploadImage, validateImageFile, deleteImage } from '@/lib/imageUpload';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  mushroomName: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  mushroomName,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset image error when value changes
  useEffect(() => {
    setImageError(false);
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setImageError(false);

    try {
      // Delete old image if it exists and is from our storage
      if (value) {
        await deleteImage(value);
      }

      // Upload new image
      const url = await uploadImage(file, mushroomName);
      onChange(url);
      
      toast({
        title: "Success!",
        description: "Image uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
      
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setImageError(false);
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleRemove = async () => {
    if (disabled) return;

    if (value) {
      await deleteImage(value);
    }
    onChange(null);
    setUploadError(null);
  };

  const triggerFileSelect = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-white">Image</Label>
      
      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          {imageError ? (
            <div className="w-32 h-32 flex items-center justify-center bg-purple-800/50 border border-purple-500/50 rounded-lg">
              <div className="flex flex-col items-center space-y-1">
                <ImageIcon className="h-8 w-8 text-purple-400" />
                <span className="text-xs text-purple-300">Image not found</span>
              </div>
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-purple-500/50"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-purple-500/50 hover:border-purple-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
              <p className="text-sm text-purple-300">Uploading image...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-purple-400 mx-auto" />
              <p className="text-sm text-purple-300">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP, or GIF up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input Option */}
      <div className="space-y-2">
        {!showUrlInput ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(true)}
            disabled={disabled || isUploading}
            className="bg-purple-800/50 border-purple-500/50 text-white hover:bg-purple-700/50"
          >
            <Link className="h-3 w-3 mr-1" />
            Use Image URL Instead
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-purple-800/50 border-purple-500/50 text-white flex-1"
              disabled={disabled}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Set
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              disabled={disabled}
              className="bg-purple-800/50 border-purple-500/50"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {uploadError && (
        <p className="text-red-400 text-sm">{uploadError}</p>
      )}
    </div>
  );
}; 