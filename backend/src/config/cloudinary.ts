import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create memory storage for temporary file handling
const storage = multer.memoryStorage();

// Create multer instance for verification documents
export const uploadVerificationDocs = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
    }
  }
});

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  options: {
    folder: string;
    public_id: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
  }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.public_id,
        resource_type: options.resource_type || 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: options.resource_type !== 'raw' 
          ? [{ width: 1200, height: 1200, crop: 'limit' }]
          : undefined
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(stream);
  });
};

// Helper function to delete files from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
  }
};

// Helper to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  const folder = parts.slice(parts.indexOf('talentspotting')).slice(0, -1).join('/');
  return `${folder}/${publicId}`;
};

export { cloudinary }; 