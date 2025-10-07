"use client"

import { useState, useEffect } from "react"
import { MessageForm } from "@/components/message-form"
import { PostItNote } from "@/components/post-it-note"
import { getMessages, addMessage, subscribeToMessages, type Message } from "@/lib/database"

export default function BirthdayWall() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [confettiInstances, setConfettiInstances] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState("")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isRacketAnimating, setIsRacketAnimating] = useState(false)
  const [bouncingBalls, setBouncingBalls] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const messagesPerPage = 15

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                           window.innerWidth < 768
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Photo slideshow - Cole's photos!
  const colePhotos = [
    "/cole1.jpeg",
    "/cole2.jpeg", 
    "/cole3.jpeg",
    "/cole4.jpeg",
    "/cole5.jpeg",
    "/cole6.jpeg",
    "/cole7.jpeg"
  ]

  useEffect(() => {
    console.log("[v0] Loading messages from Supabase")
    
    // Load initial messages
    getMessages().then((data) => {
      console.log("[v0] Loaded messages:", data)
      setMessages(data)
    })

    // Subscribe to real-time updates
    const subscription = subscribeToMessages((data) => {
      console.log("[v0] Real-time messages update:", data)
      setMessages(data)
    })

    // Initialize audio
    const audioElement = new Audio("/birthday-song.mp3")
    audioElement.loop = true
    audioElement.volume = 0.6
    setAudio(audioElement)

    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
      // Cleanup subscription
      subscription.unsubscribe()
    }
  }, [])



  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const birthday = new Date("October 9, 2025 00:00:00").getTime()
      const distance = birthday - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("🎉 Happy Birthday Cole! 🎉")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Photo slideshow rotation
  useEffect(() => {
    const photoInterval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % colePhotos.length)
    }, 3000) // Change photo every 3 seconds

    return () => clearInterval(photoInterval)
  }, [colePhotos.length])

  // Calculate pagination
  const totalPages = Math.ceil(messages.length / messagesPerPage)
  const startIndex = (currentPage - 1) * messagesPerPage
  const endIndex = startIndex + messagesPerPage
  const currentMessages = messages.slice(startIndex, endIndex)

  const handleAddMessage = async (name: string, message: string) => {
    console.log("[v0] Adding new message:", { name, message })
    
    const newMessage = await addMessage(name, message)
    if (newMessage) {
      console.log("[v0] Message added successfully:", newMessage)
      // Optimistically update the UI immediately, then real-time will sync
      setMessages(prev => [newMessage, ...prev])
      setCurrentPage(1) // Reset to first page when new message is added
    } else {
      console.error("[v0] Failed to add message")
      alert("Failed to send message. Please try again!")
    }
  }

  const triggerConfetti = () => {
    const newInstanceId = Date.now()
    setConfettiInstances(prev => [...prev, newInstanceId])
    
    // Remove this instance after animation completes
    setTimeout(() => {
      setConfettiInstances(prev => prev.filter(id => id !== newInstanceId))
    }, 4500) // Slightly longer than animation duration
  }

  const triggerTennisAnimation = () => {
    setIsRacketAnimating(true)
    
    // Create a new bouncing ball after a short delay (racket hit timing)
    setTimeout(() => {
      const newBallId = Date.now()
      setBouncingBalls(prev => [...prev, newBallId])
      
      // Remove the ball after 4 seconds
      setTimeout(() => {
        setBouncingBalls(prev => prev.filter(id => id !== newBallId))
      }, 4000)
    }, 300) // Delay to sync with racket swing
    
    // Stop racket animation after 1 second
    setTimeout(() => {
      setIsRacketAnimating(false)
    }, 1000)
  }

  const toggleMusic = () => {
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(console.error)
      setIsPlaying(true)
    }
  }

  // Mobile blocking screen
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#c8d6b0] flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🖥️</div>
          <h1 className="text-3xl font-bold text-[#4A90E2] mb-4 handwritten">
            Desktop Only!
          </h1>
          <p className="text-lg text-gray-700 mb-6 handwritten">
            Cole's birthday website is designed for desktop computers only. 
          </p>
          <p className="text-base text-gray-600 handwritten">
            Please visit this site on a computer or laptop to experience all the interactive features, animations, and birthday fun! 🎂
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Made with ❤️ by @s7brinas
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#c8d6b0] relative overflow-x-hidden">
      {/* Confetti */}
      {confettiInstances.map((id) => (
        <div key={id} className="confetti fixed animate-fall z-40" />
      ))}

      {/* Bouncing Tennis Balls */}
      {bouncingBalls.map((id) => (
        <img
          key={id}
          src="/tennis-ball.png"
          alt="Bouncing Tennis Ball"
          className="fixed w-12 h-12 screen-bouncing-ball"
          style={{
            right: '380px',
            top: '200px',
            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
          }}
        />
      ))}

      {/* Photo Slideshow - Positioned in upper area */}
      <div className="hidden md:block absolute top-30 z-30" style={{left: '250px'}}>
        <div className="w-45 h-45 rounded-full overflow-hidden shadow-lg border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <img
            src={colePhotos[currentPhotoIndex]}
            alt={`Cole photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-sm text-green-800 handwritten mt-2">birthday boy!</p>
      </div>

      {/* Animated Tennis Racket - Right side */}
      <div 
        className="hidden md:block absolute top-44 z-30 cursor-pointer" 
        style={{right: '400px'}}
        onClick={triggerTennisAnimation}
      >
        <div className="relative">
          <img 
            src="/racket.png" 
            alt="Tennis Racket" 
            className={`w-32 h-32 transform transition-transform duration-200 ${
              isRacketAnimating ? 'tennis-swing' : 'rotate-6 hover:rotate-12'
            }`}
            style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
          />
          <img 
            src="/tennis-ball.png" 
            alt="Tennis Ball" 
            className={`w-8 h-8 absolute -top-2 -right-2 transition-all duration-200 ${
              isRacketAnimating ? 'ball-bounce' : ''
            }`}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
          />
        </div>
        <p className="text-center text-sm text-green-800 handwritten mt-2">Click me!</p>
      </div>

      {/* Fixed decorative elements */}
      <img 
        src="/drums.png" 
        alt="Drums" 
        className="fixed top-4 left-4 w-16 h-16 md:w-20 md:h-20 z-50 rotate-12 hover:-rotate-6 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />
      <img 
        src="/pikachu.PNG" 
        alt="Pikachu" 
        className="fixed top-8 right-8 w-24 h-24 md:w-32 md:h-32 z-50 -rotate-6 hover:rotate-3 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />
      <img 
        src="/jigglypuff.PNG" 
        alt="Jigglypuff" 
        className="fixed top-1/3 left-8 w-20 h-20 md:w-28 md:h-28 z-50 -rotate-12 hover:-rotate-6 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />
      <img 
        src="/guitar.png" 
        alt="Guitar" 
        className="fixed top-1/3 right-8 w-20 h-20 md:w-28 md:h-28 z-50 rotate-6 hover:rotate-12 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />
      <img 
        src="/piano.png" 
        alt="Piano" 
        className="fixed bottom-24 left-8 w-20 h-20 md:w-28 md:h-28 z-50 rotate-3 hover:-rotate-3 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />
      <img 
        src="/pokeball.PNG" 
        alt="Pokeball" 
        className="fixed bottom-24 right-8 w-20 h-20 md:w-28 md:h-28 z-50 -rotate-3 hover:rotate-6 transition-transform duration-300"
        style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
      />

      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <img 
          src="/title.png" 
          alt="Happy Birthday Cole!" 
          className="mx-auto mb-2 max-w-full h-auto"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        />
        <p className="text-lg text-green-800 handwritten">
          coded by @s7brinas
        </p>
        <div className="flex justify-center gap-6 mt-1">
          <a 
            href="https://www.instagram.com/s7brinas/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 hover:text-green-900 underline handwritten text-lg transition-colors"
          >
            Instagram
          </a>
          <a 
            href="https://www.tiktok.com/@s7brinas" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 hover:text-green-900 underline handwritten text-lg transition-colors"
          >
            TikTok
          </a>
        </div>
        
        {/* Countdown Timer */}
        <div className="flex justify-center mt-6">
          <div className="bg-[#f5e6a8] rounded-full px-6 py-3 shadow-lg">
            <p className="text-lg text-gray-700 handwritten font-semibold text-center">
              Time until Cole's Birthday: {timeLeft}
            </p>
          </div>
        </div>
        
        {/* Centered Buttons */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <button
            onClick={() => setShowMessageForm(true)}
            className="bg-[#7db8e8] hover:bg-[#6ba8d6] text-white font-bold py-4 px-8 rounded-full text-xl handwritten shadow-lg hover:shadow-xl transition-all"
          >
            🎂 Send a Birthday Message! 🎂
          </button>
          
          <div className="flex gap-4 items-center">
            <button
              onClick={triggerConfetti}
              className="bg-[#f8d7da] hover:bg-[#f5c2c7] text-gray-800 font-bold py-3 px-6 rounded-full text-lg handwritten shadow-lg hover:shadow-xl transition-all"
            >
              Click Me!
            </button>
            
            <button
              onClick={toggleMusic}
              className={`${
                isPlaying 
                  ? 'bg-[#90EE90] hover:bg-[#7FDD7F]' 
                  : 'bg-[#FFB6C1] hover:bg-[#FF9FAC]'
              } text-gray-800 font-bold py-3 px-6 rounded-full text-lg handwritten shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
            >
              {isPlaying ? '🎵 Pause Music' : '🎶 Play Music'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages from fans label with arrow */}
      <div className="relative max-w-6xl mx-auto mb-4">
        <div className="absolute left-20 -top-20">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#4A90E2] handwritten transform -rotate-12 mb-2">
              Messages from fans!
            </h2>
            <div className="text-6xl text-[#4A90E2] transform rotate-12">
              ↙
            </div>
          </div>
        </div>
      </div>

      {/* Post-it notes wall */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-[#b8cfe5] rounded-3xl p-8 min-h-[500px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentMessages.map((msg) => (
              <PostItNote key={msg.id} name={msg.name} message={msg.message} />
            ))}
          </div>
          {messages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-3xl text-[#7a9b5c] handwritten">No messages yet! Be the first!</p>
            </div>
          )}
          

        </div>
        
        {/* Pagination - Outside the blue box */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-[#7db8e8] text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed handwritten text-lg"
            >
              ← Previous
            </button>
            
            <span className="text-xl text-[#7a9b5c] handwritten font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-[#7db8e8] text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed handwritten text-lg"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Message Form Popup */}
      {showMessageForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="relative max-w-2xl w-full pointer-events-auto">
            <button
              onClick={() => setShowMessageForm(false)}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg z-10"
            >
              ×
            </button>
            <MessageForm onSubmit={async (name, message) => {
              await handleAddMessage(name, message)
              setShowMessageForm(false)
            }} />
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {confettiInstances.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {confettiInstances.map((instanceId) => 
            Array.from({ length: 80 }, (_, i) => {
              const images = ['/benji.png', '/yogurt.png', '/tennis-ball.png']
              const randomImage = images[Math.floor(Math.random() * images.length)]
              const randomLeft = Math.random() * 100 // spread across screen
              const randomDelay = Math.random() * 1000 // random delays
              const fallDuration = 3 + Math.random() * 2 // varied fall speeds
              
              return (
                <div
                  key={`${instanceId}-${i}`}
                  className="absolute"
                  style={{
                    left: `${randomLeft}%`,
                    top: `${-100 - Math.random() * 50}px`, // start higher with variation
                    animation: `fall ${fallDuration}s ease-out ${randomDelay}ms forwards`,
                  }}
                >
                  <img
                    src={randomImage}
                    alt="Confetti"
                    className="w-12 h-12"
                    style={{
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
