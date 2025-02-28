import { useState, useEffect } from 'react'

const lyrics = [
  "And I just blame everything on you At least you know that's what I'm good at",
  "Cause I always find something wrong",
  "See, you been puttin' up with my shit just way too long",
  "I'm so gifted at finding what I don't like the most",
  "Run away from me, baby",
  "Run away",
  "Why can't she just, run away?",
  "Run away as fast as you can",
  "Here's the fool plan Run away as fast as you, as you can",
  "I need you to run right back to me, baby"
]

const Footer = () => {
  const [lyric, setLyric] = useState('')

  useEffect(() => {
    setLyric(lyrics[Math.floor(Math.random() * lyrics.length)])
  }, [])

  return (
    <footer className="bg-black text-white py-4 text-center">
      <p className="text-sm italic">{lyric}</p>
      <p className="text-xs mt-2">© 2025 Sports Stream. All rights reserved.</p>
    </footer>
  )
}

export default Footer

