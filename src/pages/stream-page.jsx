"use client"

import { useState, useEffect } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Loader2, Monitor, Globe, Wifi, Shield, ExternalLink } from "lucide-react"

const API_BASE_URL = "https://streamed.pk/api"

const makeApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

const fetchStreamsForSource = async (source, id) => {
  if (!source || !id) return [];
  
  try {
    const endpoint = `/stream/${source.toLowerCase()}/${id}`;
    const data = await makeApiRequest(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching streams for ${source}:`, error);
    return [];
  }
};

const StreamPage = () => {
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [matchDetails, setMatchDetails] = useState(null);
  
  const location = useLocation();
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { title: initialTitle, sources: initialSources } = location.state || {};

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

  const fetchStreams = async (sourcesArray) => {
    if (!sourcesArray?.length) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const streamPromises = sourcesArray.map(source => 
        fetchStreamsForSource(source.source, source.id)
      );
      
      const streamResults = await Promise.all(streamPromises);
      const allStreams = streamResults.flat().filter(stream => stream?.embedUrl);
      
      setStreams(allStreams);
      if (allStreams.length > 0) {
        setCurrentStream(allStreams[0]);
      }
    } catch (error) {
      console.error("Error in fetchStreams:", error);
      setError("Failed to load stream data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatchData = async () => {
    if (!matchId) {
      setError("No match ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const matches = await makeApiRequest('/matches/all');
      const match = matches.find(m => 
        m.id === matchId || 
        m.title?.toLowerCase().includes(matchId.toLowerCase())
      );
      
      if (!match) {
        throw new Error('Match not found');
      }
      
      setMatchDetails(match);
      
      if (match.sources?.length > 0) {
        await fetchStreams(match.sources);
      } else if (initialSources?.length) {
        await fetchStreams(initialSources);
      } else {
        setError('No streams available for this match');
      }
    } catch (error) {
      console.error("Error fetching match data:", error);
      setError(error.message || "Failed to load match data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      await fetchMatchData();
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [matchId, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" /> Go back
        </button>
        
        <div className="max-w-2xl mx-auto bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-black border-b border-border/10 py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="overflow-hidden">
            <h1 className="text-xl md:text-2xl font-bold truncate">
              {matchDetails?.title || initialTitle || `Match: ${matchId}`}
            </h1>
            {matchDetails?.category && (
              <p className="text-sm text-muted-foreground truncate">
                {matchDetails.category}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            {currentStream ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border/10 shadow-xl relative">
                <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}></div>
                <iframe
                  src={currentStream.embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen"
                  title={`Stream ${currentStream.streamNo}`}
                />
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
              {streams.length > 0 ? (
                <ul className="space-y-3">
                  {streams.map((stream) => (
                    <li
                      key={`${stream.source}-${stream.streamNo}`}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        currentStream === stream
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-black hover:bg-black/80 border border-border/10 hover:border-primary/20"
                      }`}
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

export default StreamPage