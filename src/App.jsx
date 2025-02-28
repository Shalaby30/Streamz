import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import Live from "./pages/live"
import StreamPage from "./pages/stream-page"
import SportsMatches from './pages/sports-matches';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/live" element={<Live />} />
            <Route path="/matches/:sportName" element={<SportsMatches />} />
            <Route path="/stream/:matchId" element={<StreamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

