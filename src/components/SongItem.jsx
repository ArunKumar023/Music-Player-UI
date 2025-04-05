import React from 'react';

const SongItem = ({ song, onPlay, onFavorite, isActive, index }) => {
  return (
    <div
      className={`song-item ${isActive ? 'active' : ''}`}
      onClick={() => onPlay(song)}
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