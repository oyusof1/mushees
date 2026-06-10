import { supabase } from './supabase';

const BUCKET_NAME = 'mushroom-images';

// Target dimensions/quality for stored images. The site only ever displays
// images at <=900px (the enlarge modal is max-w-4xl), so storing anything
// larger just wastes Supabase egress. Compressing here keeps each file ~150-250KB
// instead of the 4-5MB phone originals, which is what blew past the free-tier
// egress limit.
const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.65;

// Resize + recompress an image file in the browser before upload.
// Falls back to the original file if compression fails for any reason.
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    // GIFs would lose animation if drawn to a canvas; leave them untouched.
    if (file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob && blob.size < file.size ? blob : file),
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

// Test if a public URL is accessible
const testPublicUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error testing public URL:', error);
    return false;
  }
};

// Initialize storage bucket (run this once to create the bucket)
export const initializeBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      // Create bucket with public access
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      console.log('Bucket created successfully with public access');
    } else {
      // Verify bucket is public
      const bucket = buckets?.find(b => b.name === BUCKET_NAME);
      if (bucket && !bucket.public) {
        console.warn('Bucket exists but is not public. You may need to update bucket settings in Supabase dashboard.');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing bucket:', error);
    return false;
  }
};

// Upload image file and return public URL
export const uploadImage = async (file: File, mushroomName: string): Promise<string> => {
  try {
    // Initialize bucket if needed
    await initializeBucket();

    // Compress/resize before upload to keep egress low (4-5MB -> ~200KB).
    const uploadBlob = await compressImage(file);
    const isJpeg = uploadBlob !== file; // compressImage outputs JPEG when it runs
    console.log(`Compressed ${(file.size / 1024).toFixed(0)}KB -> ${(uploadBlob.size / 1024).toFixed(0)}KB`);

    // Generate unique filename
    const fileExt = isJpeg ? 'jpg' : (file.name.split('.').pop() || 'jpg');
    const fileName = `${mushroomName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.${fileExt}`;

    console.log('Uploading file with name:', fileName);

    // Upload file. Long cache lifetime: filenames are unique (timestamped), so a
    // 1-year immutable cache is safe and lets browsers/CDN avoid re-downloading.
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uploadBlob, {
        cacheControl: '31536000',
        contentType: isJpeg ? 'image/jpeg' : file.type,
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    console.log('Upload successful, data:', data);
    
    // Get public URL using the file path
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    console.log('Generated public URL:', publicUrl);
    
    // Verify the URL is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('Public URL not accessible:', response.status, response.statusText);
      }
    } catch (fetchError) {
      console.warn('Could not verify public URL accessibility:', fetchError);
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from storage
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName || !imageUrl.includes(BUCKET_NAME)) {
      // Not a Supabase storage URL, skip deletion
      return true;
    }
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Validate image file
export const validateImageFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WebP, or GIF)';
  }
  
  if (file.size > maxSize) {
    return 'Image file must be less than 10MB';
  }
  
  return null; // No errors
}; 