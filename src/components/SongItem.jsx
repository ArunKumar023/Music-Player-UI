import React from 'react';
import '../styles/SongItem.scss';

const SongItem = ({ song, onPlay, onFavorite, isActive, index }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(song);
  };

  return (
    <div
      className={`song-item ${isActive ? 'active' : ''}`}
      onClick={handlePlayClick}
      style={{ '--index': index }}
    >
      <img src={song.thumbnail} alt={song.title} />
      <div className="song-details">
        <h4>{song.title}</h4>
        <p>{song.artistName}</p>
      </div>
      <span className="duration">{song.duration}</span>
      {onFavorite && (
        <button
          className="favorite-btn"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(song);
          }}
        >
          ♥
        </button>
      )}
    </div>
  );
};

export default SongItem;