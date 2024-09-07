// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Home from './pages/Home';
import MediaList from './pages/MediaList';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import MediaItemDetail from './pages/MediaItemDetail';
import CustomLists from './pages/CustomLists';
import CustomListDetail from './pages/CustomListDetail';
import Recommendations from './pages/Recommendations';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/media" element={<MediaList />} />
          <Route path="/media/:id" element={<MediaItemDetail />} />
          <Route path="/lists" element={<CustomLists />} />
          <Route path="/lists/:id" element={<CustomListDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
