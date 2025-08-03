import SportsList from "../components/sports-list"
import PopularMatches from "./popular-matches"

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Live Sports Streaming
          </h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Watch your favorite sports events live with high-quality streams. Browse by category or check out popular
            matches below.
          </p>
        </div>
      </div>

      <SportsList />

      <div className="py-8">
        {/* Football Matches */}
        <PopularMatches sport="Football" apiUrl="https://streamed.pk/api/matches/football/popular" />

        {/* Basketball Matches */}
        <PopularMatches sport="Basketball" apiUrl="https://streamed.pk/api/matches/basketball/popular" />
      </div>
    </div>
  )
}

export default Home

