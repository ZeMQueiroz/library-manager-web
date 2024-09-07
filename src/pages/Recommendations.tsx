import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Button,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Construction } from '@mui/icons-material';

const Recommendations: React.FC = () => {
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen dark:bg-dark-300">
      <Box className="flex flex-col items-center">
        <Construction
          className="text-yellow-500 mb-2"
          style={{ fontSize: 60 }}
        />
        <Typography variant="h6" className="text-gray-400 mb-2 pb-6">
          This section is under construction
        </Typography>
        <CircularProgress color="primary" />
      </Box>

      <Button
        variant="contained"
        color="primary"
        className="mt-12"
        style={{ paddingTop: '10px', paddingBottom: '10px', marginTop: '20px' }}
        disabled
      >
        More Recommendations Coming Soon!
      </Button>
    </Box>
  );
};

export default Recommendations;
