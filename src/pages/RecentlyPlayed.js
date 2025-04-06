import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SongList from '../components/SongList';

const RecentlyPlayed = () => {
  const { songs, onPlay, onFavorite, currentSong } = useOutletContext();
  const recentlyPlayed = JSON.parse(sessionStorage.getItem('recentlyPlayed')) || [];
  
  return (
    <div className="song-list-container open">
      <h2>Recently Played</h2>
      <SongList songs={recentlyPlayed} onPlay={onPlay} onFavorite={onFavorite} currentSong={currentSong} />
    </div>
  );
};

export default RecentlyPlayed;