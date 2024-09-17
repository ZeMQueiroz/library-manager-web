import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCustomLists,
  createCustomList,
  updateCustomList,
  deleteCustomList,
} from '../services/api';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Badge,
} from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomList } from '../types/types';

const CustomLists: React.FC = () => {
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newListName, setNewListName] = useState<string>('');
  const [newListCategory, setNewListCategory] = useState<number>(1); // Default to 'Book'
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [editListId, setEditListId] = useState<number | null>(null);
  const [editListName, setEditListName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);
  const [totalLists, setTotalLists] = useState<number | null>(0);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [editListItems, setEditListItems] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomLists()
      .then((response) => {
        setCustomLists(response.data.results);
        setTotalLists(response.data.count);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch custom lists', error);
        setLoading(false);
      });
  }, []);

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    createCustomList({
      name: newListName,
      items: [],
      category: newListCategory,
    })
      .then((response) => {
        setCustomLists([...customLists, response.data]);
        setOpenCreateDialog(false);
        setNewListName('');
        setNewListCategory(1);
      })
      .catch((error) => {
        console.error('Failed to create list', error);
      });
  };

  const handleDeleteList = (listId: number) => {
    setDeleteDialogOpen(true);
    setListToDelete(listId);
  };

  const confirmDeleteList = () => {
    if (listToDelete) {
      deleteCustomList(listToDelete)
        .then(() => {
          setCustomLists(
            customLists.filter((list) => list.id !== listToDelete)
          );
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error('Failed to delete list', error);
        });
    }
  };

  const handleOpenEditDialog = (list: CustomList) => {
    setEditListId(list.id);
    setEditListName(list.name);
    setEditListItems(list.items.map((item) => item.cover_url));
    setSelectedBackground(list.items[0]?.cover_url || null);
  };

  const handleUpdateList = () => {
    if (!editListName.trim() || editListId === null) return;

    // Find the current list's category by ID
    const currentList = customLists.find((list) => list.id === editListId);
    const currentCategory = currentList
      ? currentList.category
      : newListCategory;

    updateCustomList(editListId, {
      name: editListName,
      items: [], // Update items as necessary
      background_image: selectedBackground, // Include the selected background image
      category: currentCategory, // Include the category
    })
      .then((response) => {
        setCustomLists(
          customLists.map((list) =>
            list.id === editListId
              ? {
                  ...list,
                  name: response.data.name,
                  background_image: response.data.background_image, // Update the background image from the response
                  category: response.data.category,
                }
              : list
          )
        );
        setEditListId(null);
        setEditListName('');
        setSelectedBackground(null);
      })
      .catch((error) => {
        console.error('Failed to update list', error);
      });
  };

  return (
    <Box className="p-4 min-h-screen flex flex-col dark:bg-dark-300">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" color="primary" fontWeight="bold">
          Custom Lists
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateDialog(true)}
          startIcon={<Add />}
        >
          Create New
        </Button>
      </Stack>

      <Typography variant="body2" color="textSecondary" mb={2}>
        {totalLists} lists
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" width="100%">
            <CircularProgress />
          </Box>
        ) : (
          customLists.map((list) => {
            const categoryLabel = list.category === 1 ? 'Book' : 'Anime';
            const categoryColor = list.category === 1 ? '#0077b6' : '#f07900';

            return (
              <Box
                key={list.id}
                sx={{ flex: '0 0 280px', position: 'relative' }}
              >
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow"
                  sx={{
                    width: '260px',
                    height: '200px',
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(${list.background_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                    '&:hover .MuiCardActions-root': { opacity: 1 },
                  }}
                  onClick={() => navigate(`/lists/${list.id}`)}
                >
                  <CardContent
                    sx={{
                      backgroundColor:
                        list.items.length > 0 ? 'rgba(0, 0, 0, 0.6)' : '',
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 2,
                    }}
                  >
                    <Badge
                      badgeContent={categoryLabel}
                      color="primary"
                      sx={{
                        mb: 1,
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          height: 'auto',
                          padding: '1px 6px',
                          borderRadius: '12px',
                          backgroundColor: categoryColor,
                          marginRight: '14px',
                        },
                      }}
                    />
                    <Typography
                      variant="h6"
                      component="div"
                      fontWeight="bold"
                      mb={1}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {list.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {list.items.length} items
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                    className="MuiCardActions-root"
                  >
                    <IconButton
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenEditDialog(list);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Box>
            );
          })
        )}
      </Box>

      {/* Create List Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create New List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={newListCategory}
              onChange={(e) => setNewListCategory(Number(e.target.value))}
              label="Category"
            >
              <MenuItem value={1}>Book</MenuItem>
              <MenuItem value={2}>Anime</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateList} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog
        open={!!editListId}
        onClose={() => {
          setEditListId(null);
          setEditListName('');
          setSelectedBackground(null); // Reset selection when dialog is closed
        }}
      >
        <DialogTitle>Edit List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New List Name"
            type="text"
            fullWidth
            value={editListName}
            onChange={(e) => setEditListName(e.target.value)}
          />
          {editListItems.length > 0 && (
            <Box sx={{ mt: 2, maxHeight: '150px', overflowY: 'auto' }}>
              <Typography variant="body2" mb={1}>
                Select Background Image:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {editListItems.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`cover ${index}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border:
                        selectedBackground === url
                          ? '2px solid #007BFF'
                          : '2px solid transparent',
                    }}
                    onClick={() => setSelectedBackground(url)}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditListId(null);
              setEditListName('');
              setSelectedBackground(null);
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateList} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this list? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteList} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomLists;
