'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  error?: string;
}

interface DocumentUploaderProps {
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
  required?: boolean;
}

export function DocumentUploader({
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  maxSize = 5,
  maxFiles = 5,
  onUpload,
  onRemove,
  disabled = false,
  title = 'Upload Documents',
  description = 'Drag & drop files here, or click to select',
  required = false
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((e: any) => {
          if (e.code === 'file-too-large') return `${file.name} is larger than ${maxSize}MB`;
          if (e.code === 'file-invalid-type') return `${file.name} has an invalid file type`;
          return e.message;
        }).join(', ');
        return errorMessages;
      }).join('; ');
      
      setError(errors);
      return;
    }

    // Check max files limit
    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Create preview files
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setUploading(true);

    try {
      // Upload files
      await onUpload(acceptedFiles);
      
      // Update progress to 100%
      setFiles(prev => prev.map(f => 
        newFiles.find(nf => nf.id === f.id) ? { ...f, progress: 100 } : f
      ));
    } catch (error) {
      setError('Failed to upload files. Please try again.');
      // Remove failed uploads
      setFiles(prev => prev.filter(f => !newFiles.find(nf => nf.id === f.id)));
    } finally {
      setUploading(false);
    }
  }, [files.length, maxFiles, maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    disabled: disabled || uploading,
    multiple: maxFiles > 1
  });

  const removeFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
    onRemove?.(fileId);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-1">
          {title} {required && <span className="text-red-500">*</span>}
        </h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
          !isDragActive && "border-gray-300 dark:border-gray-700 hover:border-gray-400",
          (disabled || uploading) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDragActive ? "Drop the files here..." : description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Accepted: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} • Max size: {maxSize}MB
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile) => {
            const FileIcon = getFileIcon(uploadedFile.file);
            return (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <FileIcon className="w-10 h-10 text-gray-400" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {uploadedFile.progress < 100 && (
                    <Progress value={uploadedFile.progress} className="h-1 mt-1" />
                  )}
                </div>

                {!uploading && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(uploadedFile.id)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 