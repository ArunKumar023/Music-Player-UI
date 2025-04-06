import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ForYou from './pages/ForYou';
import TopTracks from './pages/TopTracks';
import Favorites from './pages/Favorites';
import RecentlyPlayed from './pages/RecentlyPlayed';
import './styles/App.scss';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ForYou />} />
          <Route path="/top-tracks" element={<TopTracks />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recently-played" element={<RecentlyPlayed />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;