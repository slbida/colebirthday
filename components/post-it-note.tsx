interface PostItNoteProps {
  name: string
  message: string
}

export function PostItNote({ name, message }: PostItNoteProps) {
  const rotations = ["rotate-2", "-rotate-2", "rotate-1", "-rotate-1", "rotate-3", "-rotate-3"]
  const colors = [
    "bg-[#f5e6a8]", // pastel yellow
    "bg-[#f8d7da]", // pastel pink
    "bg-[#d4edda]"  // pastel green
  ]
  
  const rotation = rotations[Math.floor(Math.random() * rotations.length)]
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  // Calculate height based on message length
  const messageLength = message.length
  let height = "h-32" // small (128px)
  
  if (messageLength > 100) {
    height = "h-56" // large (224px)
  } else if (messageLength > 50) {
    height = "h-44" // medium (176px)
  }

  return (
    <div
      className={`${color} p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${rotation} hover:scale-105 hover:rotate-0 ${height} flex flex-col relative rounded-sm`}
      style={{
        boxShadow: "4px 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <div className="text-base font-semibold text-gray-800 mb-2 handwritten">From: {name}</div>
      <div className="text-sm text-gray-700 flex-1 overflow-y-auto handwritten leading-relaxed">{message}</div>
    </div>
  )
}
