// components/GeneratedResult.tsx
import React from 'react'

interface GenerateResponse {
  id: string
  imageUrl: string
  prompt: string
  style: string
  createdAt: string
}

interface GeneratedResultProps {
  generated: GenerateResponse | null
}

export default function GeneratedResult({ generated }: GeneratedResultProps) {
  if (!generated) return null

  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-white mb-3">
        Generated Result
      </h2>
      <div className="w-[320px] h-[220px] rounded-xl overflow-hidden shadow-lg border border-gray-700">
        <img
          src={generated.imageUrl}
          alt={generated.prompt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
