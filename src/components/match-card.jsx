import { useNavigate } from "react-router-dom"
import { Trophy } from 'lucide-react'

const MatchCard = ({ match }) => {
  const navigate = useNavigate()

  const formatMatchTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatMatchDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const handleMatchClick = () => {
    navigate(`/stream/${match.id}`, {
      state: {
        matchId: match.id,
        title: match.title,
        sources: match.sources,
      },
    })
  }

  return (
    <div
      onClick={handleMatchClick}
      className="group flex-shrink-0 w-[300px] bg-black/40 border border-border/5 rounded-xl overflow-hidden cursor-pointer hover:bg-black/60 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-primary/20"
    >
      {match.poster ? (
        <div className="relative w-full h-[168px] overflow-hidden">
          <img
            src={`https://streamed.su${match.poster}`}
            alt={match.title || "Match Poster"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="w-full h-[168px] bg-gradient-to-br from-background/80 to-background flex items-center justify-center p-4">
          <div className="flex items-center justify-between w-full">
            {match.teams?.home ? (
              <div className="flex flex-col items-center">
                {match.teams.home.badge ? (
                  <img
                    src={`https://streamed.su/api/images/badge/${match.teams.home.badge}.webp`}
                    className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-1">
                  {match.teams.home.name}
                </span>
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <span className="text-primary font-semibold">VS</span>
              <span className="text-xs text-muted-foreground mt-1">{formatMatchTime(match.date)}</span>
            </div>
            {match.teams?.away ? (
              <div className="flex flex-col items-center">
                {match.teams.away.badge ? (
                  <img
                    src={`https://streamed.su/api/images/badge/${match.teams.away.badge}.webp`}
                    className="w-16 h-16 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-1">
                  {match.teams.away.name}
                </span>
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-foreground font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {match.title}
            </h3>
            <p className="text-muted-foreground text-xs mt-1">{match.category}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{formatMatchDate(match.date)}</span>
          <span className="text-xs bg-primary/10 px-2 py-1 rounded-full text-primary font-medium">
            {formatMatchTime(match.date)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MatchCard
