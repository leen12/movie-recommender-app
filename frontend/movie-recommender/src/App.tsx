import { useState, useCallback } from '@lynx-js/react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/ui/Navbar';
import { HomePage } from './pages/HomePage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Movie } from './services/movieService';
import { TVShow } from './services/tvService';

// Define page types
type Page = 'home' | 'movies' | 'tvShows' | 'search' | 'profile' | 'login' | 'register' | 'movieDetail' | 'tvShowDetail';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  
  // Navigation handlers
  const navigateToHome = useCallback(() => {
    'background only'
    setCurrentPage('home');
  }, []);
  
  const navigateToMovies = useCallback(() => {
    'background only'
    setCurrentPage('movies');
  }, []);
  
  const navigateToTVShows = useCallback(() => {
    'background only'
    setCurrentPage('tvShows');
  }, []);
  
  const navigateToSearch = useCallback(() => {
    'background only'
    setCurrentPage('search');
  }, []);
  
  const navigateToProfile = useCallback(() => {
    'background only'
    setCurrentPage('profile');
  }, []);
  
  const navigateToLogin = useCallback(() => {
    'background only'
    setCurrentPage('login');
  }, []);
  
  const navigateToRegister = useCallback(() => {
    'background only'
    setCurrentPage('register');
  }, []);
  
  // Content selection handlers
  const handleMovieSelect = useCallback((movie: Movie) => {
    'background only'
    setSelectedMovie(movie);
    setCurrentPage('movieDetail');
  }, []);
  
  const handleTVShowSelect = useCallback((tvShow: TVShow) => {
    'background only'
    setSelectedTVShow(tvShow);
    setCurrentPage('tvShowDetail');
  }, []);
  
  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onMovieSelect={handleMovieSelect} 
            onTVShowSelect={handleTVShowSelect} 
          />
        );
      case 'login':
        return <Login onRegisterClick={navigateToRegister} />;
      case 'register':
        return <Register onLoginClick={navigateToLogin} />;
      // Other pages will be implemented later
      default:
        return (
          <view className="page-not-implemented">
            <text className="page-title">{currentPage} Page</text>
            <text className="page-message">This page is coming soon!</text>
            <button className="back-button" bindtap={navigateToHome}>
              <text>Back to Home</text>
            </button>
          </view>
        );
    }
  };
  
  return (
    <AuthProvider>
      <view className="app-container">
        <Navbar 
          onHomeClick={navigateToHome}
          onMoviesClick={navigateToMovies}
          onTVShowsClick={navigateToTVShows}
          onSearchClick={navigateToSearch}
          onProfileClick={navigateToProfile}
          onLoginClick={navigateToLogin}
        />
        
        <view className="page-container">
          {renderPage()}
        </view>
      </view>
    </AuthProvider>
  );
}
