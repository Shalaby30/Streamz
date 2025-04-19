"use client"

import { useState, useEffect } from "react"
import { useLocation, useParams, Link } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Loader2, Monitor, Globe, Wifi, Shield, ExternalLink } from "lucide-react"

const API_BASE_URL = "https://streamed.su/api"

const StreamPage = () => {
  const [streams, setStreams] = useState([])
  const [currentStream, setCurrentStream] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [matchDetails, setMatchDetails] = useState(null)
  const location = useLocation()
  const { matchId } = useParams()
  const { title, sources } = location.state || {}

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(${API_BASE_URL}/match/${matchId})
        setMatchDetails(response.data)
      } catch (error) {
        console.error("Error fetching match details:", error)
      }
    }

    fetchMatchDetails()

    if (sources) {
      fetchStreams(sources)
    } else {
      fetchStreamsFromMatchId()
    }
  }, [matchId, sources])

  const fetchStreamsFromMatchId = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(${API_BASE_URL}/streams/${matchId})
      const allStreams = response.data
      setStreams(allStreams)
      if (allStreams.length > 0) {
        setCurrentStream(allStreams[0])
      }
    } catch (error) {
      console.error("Error fetching streams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStreams = async (sourcesArray) => {
    setIsLoading(true)
    try {
      const streamPromises = sourcesArray.map(async (source) => {
        const response = await axios.get(${API_BASE_URL}/stream/${source.source}/${source.id})
        return response.data
      })

      const streamResults = await Promise.all(streamPromises)
      const allStreams = streamResults.flat()
      setStreams(allStreams)
      if (allStreams.length > 0) {
        setCurrentStream(allStreams[0])
      }
    } catch (error) {
      console.error("Error fetching streams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getQualityBadge = (stream) => {
    if (stream.hd) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500 font-medium flex items-center gap-1">
          <Monitor className="h-3 w-3" /> HD
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500 font-medium flex items-center gap-1">
        <Monitor className="h-3 w-3" /> SD
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-black border-b border-border/10 py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{matchDetails?.title || title}</h1>
            {matchDetails?.category && <p className="text-sm text-muted-foreground">{matchDetails.category}</p>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="aspect-video bg-black/60 rounded-xl flex items-center justify-center border border-border/10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading stream...</p>
                </div>
              </div>
            ) : currentStream ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border/10 shadow-xl relative">
                {/* Transparent overlay to block clicks */}
                <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}></div>
                <iframe
                  src={currentStream.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={Stream ${currentStream.streamNo}}
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-black/60 rounded-xl flex items-center justify-center border border-border/10">
                <div className="text-center p-6">
                  <p className="text-xl font-medium mb-2">No streams available</p>
                  <p className="text-muted-foreground">We couldn't find any active streams for this match.</p>
                </div>
              </div>
            )}

            {currentStream && (
              <div className="mt-6 p-6 bg-black/60 rounded-xl border border-border/10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-6 bg-primary rounded-full mr-1"></span>
                  Current Stream
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">{currentStream.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quality</p>
                      <p className="font-medium">{currentStream.hd ? "HD" : "SD"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wifi className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="font-medium">{currentStream.language || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <div className="bg-black/60 rounded-xl p-6 border border-border/10 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="inline-block w-1.5 h-6 bg-primary rounded-full mr-1"></span>
                Available Streams
              </h2>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : streams.length > 0 ? (
                <ul className="space-y-3">
                  {streams.map((stream) => (
                    <li
                      key={${stream.source}-${stream.streamNo}}
                      className={p-3 rounded-lg cursor-pointer transition-all ${
                        currentStream === stream
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-black hover:bg-black/80 border border-border/10 hover:border-primary/20"
                      }}
                      onClick={() => setCurrentStream(stream)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" />
                          {stream.source}
                        </span>
                        {getQualityBadge(stream)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Stream {stream.streamNo}</span>
                        <span className="text-xs text-muted-foreground">{stream.language || "Unknown"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No streams available</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border/10">
                <p className="text-sm text-muted-foreground mb-4">
                  Having issues with the current stream? Try another stream from the list or check back later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

