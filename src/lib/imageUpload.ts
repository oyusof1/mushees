import { supabase } from './supabase';

const BUCKET_NAME = 'mushroom-images';

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
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${mushroomName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.${fileExt}`;
    
    console.log('Uploading file with name:', fileName);
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
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