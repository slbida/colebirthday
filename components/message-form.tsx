"use client"

import type React from "react"
import { useState } from "react"

interface MessageFormProps {
  onSubmit: (name: string, message: string) => void
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted with:", { name, message })
    if (name.trim() && message.trim()) {
      onSubmit(name.trim(), message.trim())
      setName("")
      setMessage("")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#7db8e8] rounded-3xl p-8 shadow-lg border-4 border-[#5a9fd4]">
        <h2 className="text-5xl font-bold text-white text-center mb-6 handwritten">leave a note!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-white text-xl handwritten bg-white text-gray-800"
              placeholder="your name..."
              maxLength={30}
              required
            />
          </div>
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-white text-xl handwritten resize-none bg-white text-gray-800"
              placeholder="your birthday message..."
              rows={4}
              maxLength={200}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#7a9b5c] hover:bg-[#6a8b4c] text-white font-bold py-4 px-8 rounded-xl text-2xl handwritten shadow-md hover:shadow-lg transition-all"
          >
            Post it!
          </button>
        </form>
      </div>
    </div>
  )
}
