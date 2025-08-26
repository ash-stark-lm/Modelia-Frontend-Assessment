import React from 'react'

type StyleType = 'Editorial' | 'Streetwear' | 'Vintage'

interface PromptStyleFormProps {
  prompt: string
  setPrompt: (prompt: string) => void
}

export default function PromptStyleForm({
  prompt,
  setPrompt,
}: PromptStyleFormProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-200">Prompt</h3>
      <p className="text-sm text-gray-400">
        Write a short prompt to guide the AI.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. A portrait of a cyberpunk courier at dusk"
        className="mt-4 min-h-[100px] w-full resize-y rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
      />
    </div>
  )
}
