import { useCallback, useEffect, useRef, useState } from 'react'

interface UseImageUploadProps {
  onUpload?: (url: string, file: File) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // ✅ resize image if >10MB
  const processFile = useCallback(async (file: File): Promise<File> => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Only PNG and JPG images are allowed.')
    }

    if (file.size <= 10 * 1024 * 1024) return file // keep as-is

    return new Promise<File>((resolve) => {
      const img = new Image()
      const reader = new FileReader()
      reader.onload = (e) => {
        if (!e.target?.result) return
        img.src = e.target.result as string
      }
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        let { width, height } = img
        const maxDim = 1920
        if (width > height) {
          if (width > maxDim) {
            height = (height * maxDim) / width
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = (width * maxDim) / height
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) return
            const newFile = new File([blob], file.name, { type: file.type })
            resolve(newFile)
          },
          file.type,
          0.9
        )
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        try {
          console.log(
            'Original file size:',
            (file.size / 1024 / 1024).toFixed(2),
            'MB'
          )

          setFileName(file.name)
          const processedFile = await processFile(file)

          console.log(
            'Processed file size:',
            (processedFile.size / 1024 / 1024).toFixed(2),
            'MB'
          )

          const url = URL.createObjectURL(processedFile)
          setPreviewUrl(url)
          previewRef.current = url
          onUpload?.(url, processedFile)
        } catch (err) {
          alert((err as Error).message)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      }
    },
    [onUpload, processFile]
  )

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFileName(null)
    previewRef.current = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    processFile,
  }
}
