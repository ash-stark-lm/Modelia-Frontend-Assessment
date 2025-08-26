import React from 'react'

type StyleType = 'Editorial' | 'Streetwear' | 'Vintage'

interface StyleActionsProps {
  style: StyleType
  setStyle: (style: StyleType) => void
  loading: boolean
  onGenerate: () => void
  onAbort: () => void
}

export default function StyleActions({
  style,
  setStyle,
  loading,
  onGenerate,
  onAbort,
}: StyleActionsProps) {
  return (
    <div className="mt-10">
      <label className="block text-sm text-gray-300">Style</label>
      <div className="mt-2 flex justify-between">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as StyleType)}
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:outline-none"
        >
          <option value="Editorial">Editorial</option>
          <option value="Streetwear">Streetwear</option>
          <option value="Vintage">Vintage</option>
        </select>

        {loading ? (
          <button
            className="relative inline-flex h-12 min-w-[150px] overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={onAbort}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl">
              Abort
            </span>
          </button>
        ) : (
          <button
            className="cursor-pointer relative inline-flex h-12 min-w-[150px] overflow-hidden rounded-full p-[3px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={onGenerate}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl">
              Generate
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
