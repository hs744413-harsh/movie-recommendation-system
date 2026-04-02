import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SearchResults from './pages/SearchResults'

function App() {
  return (
    <div className="min-h-screen bg-netflix-black text-netflix-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:title" element={<MovieDetails />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
