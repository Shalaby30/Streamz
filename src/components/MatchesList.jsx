"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { Search, Loader2, Calendar, Filter } from "lucide-react"
import MatchCard from "./match-card"
import { Pagination } from "./ui/pagination"

const API_BASE_URL = "https://streamed.su/api"
const ITEMS_PER_PAGE = 50

const MatchesList = ({ type = "all" }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState("all") // all, today, upcoming
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1", 10))

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const endpoint = type === "live" ? "matches/live" : "matches/all"
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`)
        setMatches(response.data)
        setFilteredMatches(response.data)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [type])

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
    setCurrentPage(1)
    setSearchParams({ search: searchTerm, page: "1" })
  }, [searchTerm, matches, filterType, setSearchParams])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams({ search: searchTerm, page: page.toString() })
  }

  const paginatedMatches = filteredMatches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-foreground mb-2">
            {type === "live" ? "Live Matches" : "All Matches"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {type === "live"
              ? "Watch live sports matches happening right now."
              : "Browse and search for upcoming matches. Click on any match to view available streams."}
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
              onChange={handleSearch}
              className="w-full p-3 pl-12 bg-black text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>

          {/* Filter Buttons */}
          {type !== "live" && (
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
          )}
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : paginatedMatches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMatches.map((match) => (
                <div key={match.id} className="transition transform hover:scale-[1.02]">
                  <MatchCard match={match} />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredMatches.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-medium mb-2">No matches found</p>
            <p className="text-center max-w-md">
              {searchTerm
                ? `No matches found for "${searchTerm}". Try adjusting your search or filters.`
                : "No matches available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchesList

