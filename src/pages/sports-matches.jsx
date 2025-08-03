"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Search, Loader2, Calendar, Filter } from "lucide-react"
import MatchCard from "../components/match-card"

const API_BASE_URL = "https://streamed.pk/api"

const SportsMatches = () => {
  const { sportName } = useParams()
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sportInfo, setSportInfo] = useState(null)
  const [filterType, setFilterType] = useState("all") // all, today, upcoming

  useEffect(() => {
    setIsLoading(true)

    // Fetch sport info
    axios
      .get(`${API_BASE_URL}/sports`)
      .then((response) => {
        const sport = response.data.find((s) => s.id === sportName)
        if (sport) {
          setSportInfo(sport)
        }
      })
      .catch((error) => {
        console.error("Error fetching sport info:", error)
      })

    // Fetch matches
    axios
      .get(`${API_BASE_URL}/matches/${sportName}`)
      .then((response) => {
        setMatches(response.data)
        setFilteredMatches(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching matches:", error)
        setIsLoading(false)
      })
  }, [sportName])

  useEffect(() => {
    let filtered = matches

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((match) => match.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply date filter
    if (filterType !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.date)

        if (filterType === "today") {
          return matchDate >= today && matchDate < tomorrow
        } else if (filterType === "upcoming") {
          return matchDate >= tomorrow
        }
        return true
      })
    }

    setFilteredMatches(filtered)
  }, [searchTerm, matches, filterType])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-foreground mb-2 capitalize">
            {sportInfo?.name || sportName} Matches
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse and search for upcoming {sportInfo?.name || sportName} matches. Click on any match to view available
            streams.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-12 bg-black text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg border ${
                filterType === "all"
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              } transition-colors flex items-center gap-2`}
            >
              <Filter size={16} />
              All
            </button>
            <button
              onClick={() => setFilterType("today")}
              className={`px-4 py-2 rounded-lg border ${
                filterType === "today"
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              } transition-colors flex items-center gap-2`}
            >
              <Calendar size={16} />
              Today
            </button>
            <button
              onClick={() => setFilterType("upcoming")}
              className={`px-4 py-2 rounded-lg border ${
                filterType === "upcoming"
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              } transition-colors flex items-center gap-2`}
            >
              <Calendar size={16} />
              Upcoming
            </button>
          </div>
        </div>

        {/* Matches Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMatches.map((match) => (
              <div key={match.id} className="transition transform hover:scale-[1.02]">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-medium mb-2">No matches found</p>
            <p className="text-center max-w-md">
              No matches found for &quot;{searchTerm}&quot;. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SportsMatches

