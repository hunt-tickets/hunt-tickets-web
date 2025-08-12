"use client";

import React, { useState } from "react";
import { IconButton } from "../sub/iconButton";

interface FileUploaderProps {
  label: string;
  description: string;
  maxFiles?: number;
  maxSizeMB?: number;
  onUpload: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  description,
  maxFiles = 100,
  maxSizeMB = 5,
  onUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const filteredFiles = files.filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024
    );

    if (filteredFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setSelectedFiles(filteredFiles);
    onUpload(filteredFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const filteredFiles = files.filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024
    );

    if (filteredFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setSelectedFiles(filteredFiles);
    onUpload(filteredFiles);
  };

  return (
    <div className="flex w-full flex-col items-start gap-1">
      <span className="text-body font-body text-default-font">{label}</span>
      <div
        className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-solid border-neutral-border px-6 py-6"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <IconButton
            disabled={false}
            variant="neutral-tertiary"
            size="large"
            icon="FeatherUploadCloud"
            loading={false}
            onClick={() => document.getElementById("file-input")?.click()}
          />
          <span className="text-body font-body text-default-font text-center">
            {description}
          </span>
          <span className="text-caption font-caption text-subtext-color text-center">
            Up to {maxFiles} files, max file size {maxSizeMB}MB
          </span>
        </div>
        <input
          id="file-input"
          type="file"
          className="hidden"
          multiple={maxFiles > 1}
          onChange={handleFileChange}
        />
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-2 text-sm text-gray-300">
          <strong>Selected files:</strong>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
