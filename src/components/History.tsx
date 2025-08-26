import React from 'react'

interface GenerateResponse {
  id: string
  imageUrl: string
  prompt: string
  style: string
  createdAt: string
}

export default function History({
  items,
  onSelect,
}: {
  items: GenerateResponse[]
  onSelect: (item: GenerateResponse) => void
}) {
  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-gray-200 mb-3">History</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No history yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-700 hover:border-green-400 shadow-sm hover:shadow-md transition-all"
              onClick={() => onSelect(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-center px-2">
                <p className="text-xs text-gray-200 truncate w-full">
                  {item.prompt}
                </p>
                <span className="mt-1 text-[10px] text-green-400 font-medium">
                  {item.style}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
