"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MatchCard from "../components/match-card"

const PopularMatches = ({ sport, apiUrl }) => {
  const [matches, setMatches] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const containerRef = useRef(null)

  const scrollContainer = (direction) => {
    const container = containerRef.current
    const scrollAmount = 400

    if (container) {
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(maxScroll, scrollPosition + scrollAmount)

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })

      setScrollPosition(newPosition)
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft)
    }
  }

  const updateMaxScroll = () => {
    if (containerRef.current) {
      setMaxScroll(containerRef.current.scrollWidth - containerRef.current.clientWidth)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      updateMaxScroll()
      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", updateMaxScroll)
      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", updateMaxScroll)
      }
    }
  }, [matches]) // Update maxScroll when matches change

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(apiUrl)
        const filteredMatches = filterMatches(response.data)
        setMatches(filteredMatches)
      } catch (error) {
        console.error(`Error fetching ${sport} matches:`, error)
      }
    }

    fetchMatches()
  }, [apiUrl, sport])

  const filterMatches = (matches) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return matches.filter((match) => {
      const matchDate = new Date(match.date)
      matchDate.setHours(0, 0, 0, 0)
      return matchDate >= today
    })
  }

  return (
    <div className="mb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="inline-block w-1.5 h-6 bg-primary rounded-full mr-1"></span>
          Popular {sport}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scrollContainer("left")}
            disabled={scrollPosition <= 0}
            className={`p-2 rounded-full border border-border ${
              scrollPosition <= 0
                ? "text-muted-foreground cursor-not-allowed"
                : "text-foreground hover:bg-primary/10 hover:border-primary/50"
            } transition-colors`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollContainer("right")}
            disabled={scrollPosition >= maxScroll}
            className={`p-2 rounded-full border border-border ${
              scrollPosition >= maxScroll
                ? "text-muted-foreground cursor-not-allowed"
                : "text-foreground hover:bg-primary/10 hover:border-primary/50"
            } transition-colors`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          id={`${sport}-matches`}
          className="flex overflow-x-auto gap-4 px-6 pb-6 hide-scrollbar snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.id} className="snap-start">
                <MatchCard match={match} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[250px] text-muted-foreground">
              No upcoming {sport} matches found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PopularMatches