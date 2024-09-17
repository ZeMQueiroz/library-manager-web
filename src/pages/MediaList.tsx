import React, { useEffect, useState } from 'react';
import { fetchMediaItems, createMediaItem } from '../services/api';
import { Add } from '@mui/icons-material';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Skeleton,
  SelectChangeEvent,
  Button,
  Card,
  CardContent,
  Typography,
  Pagination, // Import Pagination component
} from '@mui/material';
import AddMediaModal from '../components/AddMediaModal';
import MediaCard from '../components/MediaCard';
import { MediaItem } from '../types/types';

const MediaList: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('title');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchFilteredItems = () => {
    setLoading(true);
    let query = `?page=${page}&page_size=24`;

    if (searchTerm) query += `&search=${searchTerm}`;
    if (filterCategory) query += `&category=${filterCategory}`;
    if (filterStatus) query += `&status=${filterStatus}`;
    if (sortOrder) query += `&ordering=${sortOrder}`;

    fetchMediaItems(query)
      .then((response) => {
        const { results, count } = response.data;
        setMediaItems(results || []);
        setTotalPages(Math.ceil(count / 24));
        setTotalItems(count);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          setError(
            `Error: ${err.response.status} - ${
              err.response.data.message || 'An error occurred.'
            }`
          );
        } else if (err.request) {
          setError('Network error: Unable to reach the server.');
        } else {
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
        setMediaItems([]);
      });
  };

  useEffect(() => {
    fetchFilteredItems();
  }, [searchTerm, filterCategory, filterStatus, sortOrder, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setFilterCategory(event.target.value as string);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFilterStatus(event.target.value as string);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as string);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateMedia = (data: {
    title: string;
    status: string;
    notes: string;
    category: string;
  }) => {
    const mediaData = {
      ...data,
      progress: 0,
      rating: null,
      description: '',
      category: parseInt(data.category, 10),
    };

    createMediaItem(mediaData)
      .then(() => {
        fetchFilteredItems();
        handleCloseModal();
      })
      .catch((err) => {
        alert('Failed to create media item. Please try again.');
        console.error(err);
      });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getStatusOptions = () => {
    let options = [
      <MenuItem key="Completed" value="Completed">
        Completed
      </MenuItem>,
      <MenuItem key="On Hold" value="On Hold">
        On Hold
      </MenuItem>,
      <MenuItem key="Dropped" value="Dropped">
        Dropped
      </MenuItem>,
    ];

    if (filterCategory === '2') {
      options = [
        <MenuItem key="To Watch" value="To Watch">
          To Watch
        </MenuItem>,
        <MenuItem key="Watching" value="Watching">
          Watching
        </MenuItem>,
        ...options,
      ];
    } else if (filterCategory === '1') {
      options = [
        <MenuItem key="To Read" value="To Read">
          To Read
        </MenuItem>,
        <MenuItem key="Reading" value="Reading">
          Reading
        </MenuItem>,
        ...options,
      ];
    }

    return options;
  };

  return (
    <div className="p-4 min-h-screen dark:bg-dark-200 text-white">
      {/* Search, Filter, and Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex w-2/5 dark:text-white"
          InputProps={{
            className: 'dark:text-white',
          }}
        />
        <FormControl variant="outlined" className="w-[200px] dark:bg-dark-200">
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={handleCategoryChange}
            label="Category"
            className="dark:text-white"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="1">Books</MenuItem>
            <MenuItem value="2">Anime</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="w-[200px] dark:bg-dark-200">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            label="Status"
            className="dark:text-white"
          >
            {getStatusOptions()}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className="min-w-[150px] dark:bg-dark-200"
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            label="Sort By"
            className="dark:text-white"
          >
            <MenuItem value="title">Title (A-Z)</MenuItem>
            <MenuItem value="-title">Title (Z-A)</MenuItem>
            <MenuItem value="-rating">Rating (High to Low)</MenuItem>
            <MenuItem value="rating">Rating (Low to High)</MenuItem>
            <MenuItem value="-progress">Progress (High to Low)</MenuItem>
            <MenuItem value="progress">Progress (Low to High)</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOpenModal}
          startIcon={<Add />}
          style={{ paddingTop: '14px', paddingBottom: '14px' }}
        >
          Add New
        </Button>
      </div>

      <div className="mb-4 pl-40">
        <Typography variant="body2" component="h1" color="gray">
          {totalItems} items
        </Typography>
      </div>

      {/* Add Media Modal */}
      <AddMediaModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateMedia}
      />

      {loading ? (
        <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="shadow-md dark:bg-dark-300">
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        <div className="flex items-center justify-center h-screen dark:bg-dark-200">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 lg:px-40">
          {mediaItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default MediaList;
