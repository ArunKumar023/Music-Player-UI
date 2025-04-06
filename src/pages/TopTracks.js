import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SongList from '../components/SongList';

const TopTracks = () => {
  const { songs, onPlay, onFavorite, currentSong } = useOutletContext();
  
  return (
    <div className="song-list-container open">
      <h2>Top Tracks</h2>
      <SongList songs={songs} onPlay={onPlay} onFavorite={onFavorite} currentSong={currentSong} />
    </div>
  );
};

export default TopTracks;