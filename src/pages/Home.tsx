import React from 'react';
import { Button } from '@mui/material'; // Material UI Button
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome to Your Media Library
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        Manage your books, anime, and other media items in one place.
      </p>
      <Link to="/media">
        <Button variant="contained" color="primary">
          Go to Media List
        </Button>
      </Link>
    </div>
  );
};

export default Home;
