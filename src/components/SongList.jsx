import React, { useState, useEffect } from 'react';
import SongItem from './SongItem';

const SongList = ({ songs, onPlay, currentSong }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [songs]);

  return (
    <div className={`song-list ${isLoading ? 'loading' : ''}`}>
      {songs.map((song, index) => (
        <SongItem
          key={song.title || index}
          song={song}
          onPlay={onPlay}
          isActive={currentSong && currentSong.title === song.title}
          index={index}
        />
      ))}
    </div>
  );
};

export default SongList;