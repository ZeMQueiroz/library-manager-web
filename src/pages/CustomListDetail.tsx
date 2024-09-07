// src/pages/CustomListDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCustomList } from '../services/api';
import { MediaItem } from '../types/types';
import MediaCard from '../components/MediaCard';
import { Box, Typography } from '@mui/material';

interface CustomListDetailProps {
  // Define props if needed
}

const CustomListDetail: React.FC<CustomListDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [customList, setCustomList] = useState<{
    name: string;
    items: MediaItem[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCustomList(id)
        .then((response) => {
          setCustomList(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch custom list details.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !customList) {
    return <Typography color="error">{error || 'List not found.'}</Typography>;
  }

  return (
    <Box className="p-4 min-h-screen flex flex-col items-center dark:bg-dark-300">
      <Typography
        variant="h4"
        component="h2"
        color="primary"
        className="font-bold mb-4"
      >
        {customList.name}
      </Typography>

      <Box className="grid gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 lg:px-40">
        {customList.items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default CustomListDetail;
