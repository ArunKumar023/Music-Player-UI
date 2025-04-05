import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaEllipsisH, FaVolumeUp, FaBackward, FaForward, FaHeart } from 'react-icons/fa';
import ColorThief from 'colorthief';

const Player = ({ currentSong, onPlayPause, onFavorite }) => {
  const audioRef = useRef(null);
  const imgRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showFavoriteOption, setShowFavoriteOption] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(to right, #121212, #1a1a1a)');

  const colorThief = new ColorThief();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    onPlayPause();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMenuClick = () => {
    setShowFavoriteOption(!showFavoriteOption);
  };

  const handleFavoriteClick = () => {
    onFavorite(currentSong);
    setShowFavoriteOption(false);
  };

  // Function to update background gradient based on cover image
  const updateBackgroundGradient = () => {
    if (imgRef.current && currentSong.coverUrl) {
      imgRef.current.crossOrigin = "Anonymous";
      imgRef.current.onload = () => {
        try {
          const colors = colorThief.getPalette(imgRef.current, 2);
          const color1 = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
          const color2 = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;
          setBackgroundGradient(`linear-gradient(to right, ${color1}, ${color2})`);
        } catch (error) {
          console.error('Error extracting colors:', error);
          setBackgroundGradient('linear-gradient(to right, #121212, #1a1a1a)');
        }
      };
      // Trigger load if image is already cached
      if (imgRef.current.complete) {
        imgRef.current.onload();
      }
    }
  };

  useEffect(() => {
    const progress = (currentTime / duration) * 100 || 0;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.setProperty('--progress', `${progress}%`);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  // Update gradient when song changes
  useEffect(() => {
    updateBackgroundGradient();
  }, [currentSong]);

  // Apply gradient to app container
  useEffect(() => {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.style.background = backgroundGradient;
    }
  }, [backgroundGradient]);

  return (
    <div className="player-controls">
      <div className="player">
        {/* Hidden image for color extraction */}
        <img
          ref={imgRef}
          src={currentSong.coverUrl}
          alt="cover"
          style={{ display: 'none' }}
        />
        
        <div className="progress-section">
          <span className="current-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
          />
          <span className="duration">{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <div className="menu-container">
            <Button
              variant="link"
              className="menu-btn"
              onClick={handleMenuClick}
            >
              <FaEllipsisH />
            </Button>
            {showFavoriteOption && (
              <Button
                variant="link"
                className="favorite-option"
                onClick={handleFavoriteClick}
              >
                <FaHeart /> Favorite
              </Button>
            )}
          </div>
          <div className="main-controls">
            <Button variant="link" className="prev-btn">
              <FaBackward />
            </Button>
            <button className="play-btn" onClick={handlePlayPause}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <Button variant="link" className="next-btn">
              <FaForward />
            </Button>
          </div>
          <Button variant="link" className="volume-btn">
            <FaVolumeUp />
          </Button>
        </div>

        <audio
          ref={audioRef}
          src={currentSong.musicUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default Player;