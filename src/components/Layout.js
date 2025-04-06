import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Player from './Player';
import SearchBar from './SearchBar';
import SongList from './SongList';
import dummyData from '../data/dummyData.json';
import '../styles/Layout.scss';
import ColorThief from 'colorthief';

const Layout = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #1a1a1a, #4a4a4a)');
  const navigate = useNavigate();
  const location = useLocation();

  const sectionTitles = {
    '/': 'For You',
    '/top-tracks': 'Top Tracks',
    '/favorites': 'Favourites',
    '/recently-played': 'Recently Played',
  };

  const currentTitle = sectionTitles[location.pathname] || 'For You';

  const colorThief = new ColorThief();

  const updateBackgroundGradient = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, 2);
        const [color1, color2] = palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
        setBackgroundGradient(`linear-gradient(135deg, ${color1}, ${color2})`);
      } catch (error) {
        console.error('Error extracting colors:', error);
        setBackgroundGradient('linear-gradient(135deg, #1a1a1a, #4a4a4a)');
      }
    };

    img.onerror = () => {
      setBackgroundGradient('linear-gradient(135deg, #1a1a1a, #4a4a4a)');
    };
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Load recently played from sessionStorage
      const storedRecentlyPlayed = JSON.parse(sessionStorage.getItem('recentlyPlayed')) || [];
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

      const validRecentlyPlayed = storedRecentlyPlayed
        .map(storedSong => dummyData.find(song => song.title === storedSong.title))
        .filter(Boolean);
      const validFavorites = storedFavorites
        .map(storedSong => dummyData.find(song => song.title === storedSong.title))
        .filter(Boolean);

      setRecentlyPlayed(validRecentlyPlayed);
      setFavorites(validFavorites);
      setSongs(dummyData);
      setCurrentSong(dummyData[3]);
      updateBackgroundGradient(dummyData[3].thumbnail);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentSong && isPlaying) {
      updateBackgroundGradient(currentSong.thumbnail);
      // Update recently played in sessionStorage
      const updatedRecentlyPlayed = [
        currentSong,
        ...recentlyPlayed.filter(song => song.title !== currentSong.title),
      ].slice(0, 10); // Keep only last 10 songs
      sessionStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecentlyPlayed));
      setRecentlyPlayed(updatedRecentlyPlayed);
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filteredSongs = [];
      switch (location.pathname) {
        case '/top-tracks':
          filteredSongs = dummyData.slice(0, 10);
          break;
        case '/favorites':
          filteredSongs = dummyData.filter(song =>
            favorites.some(fav => fav.title === song.title)
          );
          break;
        case '/recently-played':
          filteredSongs = [...recentlyPlayed];
          break;
        default:
          filteredSongs = dummyData;
      }
      setSongs(filteredSongs);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, favorites, recentlyPlayed]);

  const handlePlay = (song) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentSong(song);
      setIsPlaying(true);
      updateBackgroundGradient(song.thumbnail);
      setIsLoading(false);
    }, 500);
  };

  const handleFavorite = (song) => {
    setIsLoading(true);
    setTimeout(() => {
      if (!favorites.find(fav => fav.title === song.title)) {
        setFavorites([...favorites, song]);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = (query) => {
    setIsLoading(true);
    setTimeout(() => {
      let baseSongs = [];
      switch (location.pathname) {
        case '/top-tracks':
          baseSongs = dummyData.slice(0, 10);
          break;
        case '/favorites':
          baseSongs = dummyData.filter(song =>
            favorites.some(fav => fav.title === song.title)
          );
          break;
        case '/recently-played':
          baseSongs = [...recentlyPlayed];
          break;
        default:
          baseSongs = dummyData;
      }

      if (!query.trim()) {
        setSongs(baseSongs);
      } else {
        const searchWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const filteredSongs = baseSongs.filter(song => {
          const title = song.title?.toLowerCase() || '';
          const artist = song.artistName?.toLowerCase() || '';
          return searchWords.some(word =>
            title.includes(word) || artist.includes(word)
          );
        });
        setSongs(filteredSongs);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="app-container" style={{ background: backgroundGradient }}>
      <Button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        variant="primary"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </Button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">🎵 Music</div>
        <Navbar className="flex-column">
          <Nav className="flex-column nav-list">
            <Nav.Link onClick={() => { navigate('/'); setIsSidebarOpen(false); }} className="nav-item">
              For You
            </Nav.Link>
            <Nav.Link onClick={() => { navigate('/top-tracks'); setIsSidebarOpen(false); }} className="nav-item">
              Top Tracks
            </Nav.Link>
            <Nav.Link onClick={() => { navigate('/favorites'); setIsSidebarOpen(false); }} className="nav-item">
              Favourites
            </Nav.Link>
            <Nav.Link onClick={() => { navigate('/recently-played'); setIsSidebarOpen(false); }} className="nav-item">
              Recently Played
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="song-section">
        <div className="section-header">
          <h2>{currentTitle}</h2>
          <SearchBar onSearch={handleSearch} />
        </div>
        <SongList
          songs={songs}
          onPlay={handlePlay}
          currentSong={currentSong}
          isLoading={isLoading}
        />
      </div>

      <div className="playback-section">
        {currentSong && (
          <Player
            currentSong={{
              musicUrl: currentSong.musicUrl,
              coverUrl: currentSong.thumbnail,
              title: currentSong.title,
              artistName: currentSong.artistName,
            }}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onFavorite={handleFavorite}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;