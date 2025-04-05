import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import SongList from './components/SongList';
import Player from './components/Player';
import SearchBar from './components/SearchBar';
import dummyData from './data/dummyData.json';
import './App.scss';

const App = () => {
  const [songs, setSongs] = useState(dummyData);
  const [currentSong, setCurrentSong] = useState(dummyData[3]); // Default to "Ghost Stories"
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState(JSON.parse(sessionStorage.getItem('recentlyPlayed')) || []);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [activeSection, setActiveSection] = useState('for-you');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentSong && isPlaying) {
      const updatedRecentlyPlayed = [currentSong, ...recentlyPlayed.filter(song => song.title !== currentSong.title).slice(0, 9)];
      sessionStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecentlyPlayed));
      setRecentlyPlayed(updatedRecentlyPlayed);
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handlePlay = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleFavorite = (song) => {
    if (!favorites.find(fav => fav.title === song.title)) {
      setFavorites([...favorites, song]);
    }
  };

  const handleSearch = (query) => {
    const filteredSongs = dummyData.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase())
    );
    setSongs(filteredSongs);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'for-you':
        return <SongList songs={songs} onPlay={handlePlay} onFavorite={handleFavorite} currentSong={currentSong} />;
      case 'top-tracks':
        return <SongList songs={songs} onPlay={handlePlay} onFavorite={handleFavorite} currentSong={currentSong} />;
      case 'favorites':
        return <SongList songs={favorites} onPlay={handlePlay} onFavorite={handleFavorite} currentSong={currentSong} />;
      case 'recently-played':
        return <SongList songs={recentlyPlayed} onPlay={handlePlay} onFavorite={handleFavorite} currentSong={currentSong} />;
      default:
        return <SongList songs={songs} onPlay={handlePlay} onFavorite={handleFavorite} currentSong={currentSong} />;
    }
  };

  const sectionTitles = {
    'for-you': 'For You',
    'top-tracks': 'Top Tracks',
    'favorites': 'Your Favorites',
    'recently-played': 'Recently Played'
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">🎵 Music</div>
        <Navbar className="flex-column">
          <Nav className="flex-column nav-list">
            <Nav.Link
              href="#for-you"
              className={`nav-item ${activeSection === 'for-you' ? 'active' : ''}`}
              onClick={() => { setActiveSection('for-you'); closeSidebar(); }}
            >
              For You
            </Nav.Link>
            <Nav.Link
              href="#top-tracks"
              className={`nav-item ${activeSection === 'top-tracks' ? 'active' : ''}`}
              onClick={() => { setActiveSection('top-tracks'); closeSidebar(); }}
            >
              Top Tracks
            </Nav.Link>
            <Nav.Link
              href="#favorites"
              className={`nav-item ${activeSection === 'favorites' ? 'active' : ''}`}
              onClick={() => { setActiveSection('favorites'); closeSidebar(); }}
            >
              Favourites
            </Nav.Link>
            <Nav.Link
              href="#recently-played"
              className={`nav-item ${activeSection === 'recently-played' ? 'active' : ''}`}
              onClick={() => { setActiveSection('recently-played'); closeSidebar(); }}
            >
              Recently Played
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <div className="song-section">
        <div className="section-header">
          <Button 
            className="hamburger-btn" 
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </Button>
          <h2>{sectionTitles[activeSection]}</h2>
          <SearchBar onSearch={handleSearch} />
        </div>
        {renderSection()}
      </div>
      <div className="playback-section">
        <div className="song-info">
          <h1>{currentSong?.title || 'No Song Selected'}</h1>
          <h2>{currentSong?.artistName || ''}</h2>
        </div>
        <div className="song-cover">
          <img 
            src={currentSong?.thumbnail || 'placeholder.jpg'} 
            alt={currentSong?.title || 'No Song'} 
          />
        </div>
        <div className="player-controls">
          {currentSong && (
            <Player
              currentSong={{
                musicUrl: currentSong.musicUrl,
                coverUrl: currentSong.thumbnail,
                title: currentSong.title,
                artistName: currentSong.artistName
              }}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onFavorite={handleFavorite}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;