"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ChevronDown, Loader2 } from "lucide-react"

const API_BASE_URL = "https://streamed.su/api"

const SportsList = () => {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sports`)
      .then((response) => {
        setSports(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching sports:", error)
        setError("Failed to fetch sports data. Please try again later.")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p className="text-destructive text-xl">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
        <span className="inline-block w-1.5 h-6 bg-primary rounded-full mr-1"></span>
        Sports Categories
      </h2>

      {/* Dropdown for Mobile */}
      <div className="block md:hidden w-full text-center relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="w-full text-center text-foreground bg-black border border-border hover:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium rounded-lg text-sm px-5 py-3 inline-flex items-center justify-between transition-all duration-200"
          type="button"
        >
          Select Sport
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 bg-black border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
            <ul className="py-2 text-sm text-foreground">
              {sports.map((sport) => (
                <li key={sport.id}>
                  <button
                    onClick={() => {
                      navigate(`/matches/${sport.id}`)
                      setIsDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {sport.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Grid Layout for Larger Screens */}
      <div className="hidden md:block">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sports.map((sport) => (
            <li
              key={sport.id}
              className="bg-black border border-border hover:border-primary/50 text-center p-6 rounded-xl shadow-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/5 group"
              onClick={() => navigate(`/matches/${sport.id}`)}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {sport.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SportsList

