"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Tv, Search, X } from "lucide-react"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/schedule?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav className="bg-black border-b border-border/10 py-4 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className=" w-full flex  justify-between px-5 ">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">

            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
               Streamz
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-primary transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/schedule"
              className="hover:text-primary transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Schedule
            </Link>
            <Link
              to="/live"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div
            className={`${isSearchOpen ? "w-full md:w-[300px]" : "w-0"} transition-all duration-300 overflow-hidden`}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matches..."
                className="w-full bg-black/50 border border-border/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="flex items-center gap-4">
            <Link
              to="/live"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around mt-4 pt-4 border-t border-border/10">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Tv className="h-5 w-5" />
          Home
        </Link>
        <Link
          to="/schedule"
          className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Search className="h-5 w-5" />
          Schedule
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

