"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";


export type AcceptedFile = File & { preview?: string };

interface FileUploadInputProps {
  /**
   * Visible label for the drag-and-drop zone.
   */
  label: string;
  /**
   * HTML accept attribute (e.g. "image/*" | ".pdf" | "application/pdf,application/msword")
   */
  accept: string;
  /**
   * Optional helper text underneath.
   */
  helperText?: string;
  /**
   * Callback with uploaded file (undefined if cleared).
   */
  onChange: (file?: AcceptedFile) => void;
  /**
   * Current file (controlled). Supply to show preview.
   */
  value?: AcceptedFile;
  /**
   * When true, disables input.
   */
  disabled?: boolean;
}

/**
 * Generic file-upload component with drag-and-drop and click-to-select UX.
 * Keeps file-handling logic out of individual pages.
 */
const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  accept,
  helperText,
  onChange,
  value,
  disabled
}) => {
  // React 19 compatibility: cast to any to bypass missing type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Safe useRef for React 19 dev builds that might lack typings
const useRefSafe: <T>(init: T | null) => { current: T | null } =
  (React as any).useRef ?? ((init) => ({ current: init }));
const inputRef = useRefSafe<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const file = files[0];
    const accepted: AcceptedFile = Object.assign(file, {
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
    });
    onChange(accepted);
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors",
          dragActive ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={disabled ? undefined : handleClick}
      >
        {value?.preview ? (
          <img src={value.preview} alt="preview" className="h-full object-contain" />
        ) : (
          <>
            <svg
              aria-hidden="true"
              className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4m10 12V4m-6 12V4m-4 0h8m-4 0v16m6-8h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h2"
              ></path>
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold">{label}</span>
              <br /> or drag & drop
            </p>
            {helperText && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
};

export default FileUploadInput;
