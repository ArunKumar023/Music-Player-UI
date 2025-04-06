import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SongList from '../components/SongList';

const Favorites = () => {
  const { songs, onPlay, onFavorite, currentSong } = useOutletContext();
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  return (
    <div className="song-list-container open">
      <h2>Your Favorites</h2>
      <SongList songs={favorites} onPlay={onPlay} onFavorite={onFavorite} currentSong={currentSong} />
    </div>
  );
};

export default Favorites;