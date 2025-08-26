import React from 'react'

type StyleType = 'Editorial' | 'Streetwear' | 'Vintage'

interface LiveSummaryProps {
  prompt: string
  style: StyleType
  imageUrl: string | null
}

export default function LiveSummary({
  prompt,
  style,
  imageUrl,
}: LiveSummaryProps) {
  return (
    <div className="mt-4 rounded border border-gray-700 p-4 text-sm text-gray-100 bg-gray-900">
      <h4 className="text-base font-medium text-gray-200 mb-2">Live Summary</h4>

      {/* Flex container: left = image, right = details */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image preview */}
        <div className="md:w-1/3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="h-32 w-full object-cover rounded border border-gray-700"
            />
          ) : (
            <p className="text-gray-500 italic mb-2">No image uploaded</p>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 space-y-2">
          {/* Prompt with fixed width and wrap */}
          <div>
            <span className="text-gray-400">Prompt:</span>
            <p className="mt-1 max-w-[400px] break-words whitespace-normal text-gray-100 border border-gray-700 rounded p-2 bg-gray-800">
              {prompt || '—'}
            </p>
          </div>

          {/* Style */}
          <div>
            <span className="text-gray-400">Style:</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs ml-2">
              {style}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
