import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchMediaItem,
  updateMediaItem,
  deleteMediaItem,
  fetchCustomLists,
  addItemToList,
} from '../services/api';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Stars, Add } from '@mui/icons-material';
import { MediaItem } from '../types/types';
import placeholder_anime from '../assets/placeholder_anime.png';
import placeholder_book from '../assets/placeholder_book.png';

const MediaItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editableStatus, setEditableStatus] = useState<string>('');
  const [editableRating, setEditableRating] = useState<number | ''>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [customLists, setCustomLists] = useState<
    { id: number; name: string; category: number }[]
  >([]);
  const [filteredLists, setFilteredLists] = useState<
    { id: number; name: string; category: number }[]
  >([]);
  console.log('🚀🚀 ~  filteredLists:', filteredLists);
  const [selectedList, setSelectedList] = useState<string>('');
  console.log('🚀🚀 ~  selectedList:', selectedList);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (id) {
      fetchMediaItem(id)
        .then((response) => {
          setMediaItem(response.data);
          setEditableStatus(
            response.data.status ||
              (response.data.category === 2 ? 'To Watch' : 'To Read')
          );
          setEditableRating(response.data.rating ?? 0);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch media item');
          setLoading(false);
        });

      // Fetch custom lists
      fetchCustomLists()
        .then((response) => setCustomLists(response.data))
        .catch((error) => console.error('Failed to fetch custom lists', error));
    }
  }, [id]);

  useEffect(() => {
    if (mediaItem) {
      setFilteredLists(
        customLists.filter((list) => list.category === mediaItem.category)
      );
    }
  }, [mediaItem, customLists]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setEditableStatus(event.target.value as string);
  };

  const handleRatingChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    setEditableRating(value);
  };

  const handleSaveChanges = () => {
    if (mediaItem) {
      setSaving(true);
      const updatedItem = {
        ...mediaItem,
        status: editableStatus,
        rating: editableRating === '' ? null : editableRating,
      };
      updateMediaItem(mediaItem.id, updatedItem)
        .then(() => {
          setMediaItem(updatedItem);
          setEditing(false);
          showSnackbar('Changes saved successfully!', 'success');
        })
        .catch(() => {
          showSnackbar('Failed to save changes.', 'error');
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mediaItem) {
      deleteMediaItem(mediaItem.id)
        .then(() => {
          showSnackbar('Media item deleted successfully!', 'success');
          navigate('/media');
        })
        .catch(() => {
          showSnackbar('Failed to delete the media item.', 'error');
        });
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const getListNameById = (id: number) => {
    const list = customLists.find((list) => list.id === id);
    return list ? list.name : '';
  };

  const handleAddToList = () => {
    if (selectedList && mediaItem) {
      addItemToList(Number(selectedList), mediaItem.id)
        .then(() => {
          showSnackbar(
            `Media item added to ${getListNameById(
              Number(selectedList)
            )} successfully!`,
            'success'
          );
          setAddDialogOpen(false);
        })
        .catch(() => {
          showSnackbar('Failed to add media item to the custom list.', 'error');
        });
    }
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedList(''); // Reset selection
  };

  if (loading) {
    return (
      <Box className="p-4 min-h-screen flex justify-center dark:bg-dark-200">
        <Card className="flex flex-col md:flex-row shadow-md max-w-4xl dark:bg-dark-300">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            className="md:w-1/4 w-full object-contain"
          />
          <CardContent className="flex-1 p-6">
            <Skeleton width="60%" height={40} />
            <Skeleton width="80%" />
            <Skeleton width="100%" />
            <Skeleton width="50%" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error || !mediaItem) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-dark-200">
        <p className="text-red-500">{error || 'Item not found'}</p>
      </div>
    );
  }

  return (
    <Box className="p-4 min-h-screen flex flex-col items-center dark:bg-dark-300">
      <div className="flex w-full mb-4 flex-row items-center">
        <div className="flex w-2/5 justify-end items-center">
          <Typography
            variant="h4"
            component="h2"
            color="primary"
            className="font-bold"
          >
            {mediaItem.title}
          </Typography>
        </div>
        <div className="flex justify-end w-3/5 space-x-2">
          {!editing && (
            <Button variant="outlined" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            startIcon={<Add />}
          >
            Add to List
          </Button>
        </div>
      </div>
      <Divider className="w-full dark:bg-gray-400" />
      <Card className="w-full mt-4 max-w-4xl dark:bg-dark-100">
        <Box className="flex flex-col md:flex-row w-full max-w-4xl dark:bg-dark-100">
          <div className="flex flex-col dark:bg-dark-100">
            <CardMedia
              component="img"
              image={
                mediaItem.cover_url ||
                (mediaItem.category === 1
                  ? placeholder_book
                  : placeholder_anime)
              }
              alt={mediaItem.title}
              className="md:w-1/3 p-4 w-full object-cover"
              style={{ height: '400px', width: 'auto' }}
            />
            {!editing && (
              <Box className="flex flex-row items-center px-4 justify-between pb-4">
                <Box className="flex items-center">
                  <Typography
                    variant="subtitle2"
                    className="py-1 px-3 rounded-full shadow-md"
                    style={{
                      fontWeight: 'bold',
                      backgroundColor: '#505050',
                      color: (() => {
                        switch (editableStatus) {
                          case 'To Read':
                          case 'To Watch':
                            return '#4B9CD3';
                          case 'Reading':
                          case 'Watching':
                            return '#7CFC00';
                          case 'Completed':
                            return '#2ECC71';
                          case 'On Hold':
                            return '#FFBF00';
                          case 'Dropped':
                            return '#E74C3C';
                          default:
                            return '#333';
                        }
                      })(),
                    }}
                  >
                    {editableStatus}
                  </Typography>
                </Box>
                <div className="flex items-center">
                  <Stars color="primary" fontSize="large" />
                  <Typography
                    variant="h5"
                    color="primary"
                    className="dark:text-gray-400 pl-1"
                  >
                    {editableRating || 'N/A'}
                  </Typography>
                </div>
              </Box>
            )}
          </div>
          <Box className="flex-1 md: mt-4 md:mt-0 py-4 dark:text-gray-200">
            <Typography variant="body1" className="text-gray-300">
              {mediaItem.description || 'No description available.'}
            </Typography>
            {editing && (
              <Box className="mt-4 flex space-x-4 items-center">
                <FormControl
                  variant="outlined"
                  className="flex-grow dark:text-white"
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editableStatus}
                    onChange={handleStatusChange}
                    label="Status"
                    className="dark:text-white"
                  >
                    {mediaItem.category === 2 ? (
                      <>
                        <MenuItem value="To Watch">To Watch</MenuItem>
                        <MenuItem value="Watching">Watching</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="To Read">To Read</MenuItem>
                        <MenuItem value="Reading">Reading</MenuItem>
                      </>
                    )}
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Dropped">Dropped</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  className="w-[100px] dark:text-white"
                >
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={editableRating === '' ? '' : editableRating}
                    onChange={handleRatingChange}
                    label="Rating"
                    className="dark:text-white"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
      <Box className="mt-4 flex space-x-4">
        {editing && (
          <>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              loading={saving}
            >
              Save Changes
            </LoadingButton>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Box>

      {/* Add to Custom List Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-to-list-dialog-title"
      >
        <DialogTitle id="add-to-list-dialog-title">
          Add to Custom List
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Select a List</InputLabel>
            <Select
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
              label="Select a List"
              defaultValue=""
            >
              {filteredLists.map((list) => (
                <MenuItem key={list.id} value={list.id.toString()}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddToList}
            color="primary"
            disabled={!selectedList}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this media item? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={cancelDelete} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="outlined"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MediaItemDetail;
