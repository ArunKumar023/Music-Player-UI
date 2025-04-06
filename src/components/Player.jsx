import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaEllipsisH, FaVolumeUp, FaBackward, FaForward, FaHeart, FaTimes, FaPlay, FaPause } from 'react-icons/fa';
import '../styles/Player.scss';

const Player = ({ currentSong, onPlayPause, onFavorite, onNext, onPrevious }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showFavoriteOption, setShowFavoriteOption] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

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
    onFavorite({
      ...currentSong,
      thumbnail: currentSong.coverUrl,
    });
    setShowFavoriteOption(false);
  };

  const handleClosePlayer = () => {
    setIsPlayerVisible(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const progress = (currentTime / duration) * 100 || 0;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.setProperty('--progress', `${progress}%`);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (currentSong) {
      setIsPlayerVisible(true);
    }
  }, [currentSong]);

  return (
    <div className={`playback-section ${!isPlayerVisible ? 'hidden' : ''}`}>
      <button className="close-btn" onClick={handleClosePlayer}>
        <FaTimes />
      </button>
      <div className="player-controls">
        <div className="song-info">
          <h1>{currentSong?.title || 'No Song Selected'}</h1>
          <h2>{currentSong?.artistName || ''}</h2>
        </div>
        <div className="song-cover">
          <img
            src={currentSong?.coverUrl || 'placeholder.jpg'}
            alt={currentSong?.title || 'No Song'}
          />
        </div>
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
            <Button variant="link" className="menu-btn" onClick={handleMenuClick}>
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
            <Button variant="link" className="prev-btn" onClick={onPrevious}>
              <FaBackward />
            </Button>
            <Button variant="link" className="play-btn" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button variant="link" className="next-btn" onClick={onNext}>
              <FaForward />
            </Button>
          </div>
          <Button variant="link" className="volume-btn">
            <FaVolumeUp />
          </Button>
        </div>
        <audio
          ref={audioRef}
          src={currentSong?.musicUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default Player;