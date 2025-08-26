import React, { useCallback, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useImageUpload } from '../ui/use-image-upload'
import { ImagePlus, Upload, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'

// Update the props interface to accept a controlled URL
interface ImageUploaderProps {
  onImageUpload?: (url: string | null, file: File | null) => void
  uploadedImageUrl: string | null // ✅ Add this prop
}

export default function ImageUploader({
  onImageUpload,
  uploadedImageUrl,
}: ImageUploaderProps) {
  // ✅ Accept the new prop
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange: handleFileChangeFromHook, // Rename to avoid conflict
    handleRemove: handleRemoveFromHook, // Rename to avoid conflict
  } = useImageUpload({
    // Pass the external URL to the hook for its internal logic
    onUpload: (url, file) => {
      onImageUpload?.(url, file)
    },
  })

  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We'll let the hook handle the internal file state, but the parent
    // will now be the source of truth for the displayed image via `uploadedImageUrl`.
    handleFileChangeFromHook(e)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
        const fakeEvent = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChangeFromHook(fakeEvent) // Use the hook's handler
      } else {
        console.error('Only PNG and JPG images are allowed.')
      }
    },
    [handleFileChangeFromHook]
  )

  const handleRemoveClick = () => {
    handleRemoveFromHook() // Clear the hook's state
    onImageUpload?.(null, null as any) // Inform parent to clear its state
  }

  // Determine the URL to display: prefer the prop over the internal state
  const displayUrl = uploadedImageUrl || previewUrl

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-200">Upload Image</h3>
      <p className="text-sm text-gray-400">
        JPG or PNG — drag & drop or click to choose.
      </p>

      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!displayUrl ? ( // ✅ Use the new displayUrl here
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'mt-4 flex h-100 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-500 bg-black transition-colors hover:bg-gray-900',
            isDragging && 'border-black bg-black'
          )}
        >
          <div className="rounded-full bg-gray-900 p-3 shadow-sm">
            <ImagePlus className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-200">Click to select</p>
            <p className="text-xs text-gray-400">or drag and drop file here</p>
          </div>
        </div>
      ) : (
        <div className="relative mt-4">
          <div className="group relative h-100 overflow-hidden rounded-lg border border-gray-700">
            <img
              src={displayUrl} // ✅ Use the new displayUrl here
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleThumbnailClick}
                className="h-9 w-9 p-0 cursor-pointer"
              >
                <Upload className="h-6 w-6" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveClick}
                className="h-9 w-9 p-0 cursor-pointer"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <span className="truncate">{fileName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
