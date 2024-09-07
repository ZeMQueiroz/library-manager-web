// src/pages/CustomLists.tsx
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomList } from '../types/types';

const CustomLists: React.FC = () => {
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  console.log('🚀🚀 ~  customLists:', customLists);
  const [loading, setLoading] = useState<boolean>(true);
  const [newListName, setNewListName] = useState<string>('');
  const [newListCategory, setNewListCategory] = useState<number>(1); // Default to 'Book'
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [editListId, setEditListId] = useState<number | null>(null);
  const [editListName, setEditListName] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  // Fetch all custom lists on component mount
  useEffect(() => {
    fetchCustomLists()
      .then((response) => {
        setCustomLists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch custom lists', error);
        setLoading(false);
      });
  }, []);

  // Handle creating a new custom list
  const handleCreateList = () => {
    if (!newListName.trim()) return; // Avoid creating lists with empty names

    createCustomList({
      name: newListName,
      items: [],
      category: newListCategory,
    })
      .then((response) => {
        setCustomLists([...customLists, response.data]);
        setOpenCreateDialog(false);
        setNewListName('');
        setNewListCategory(1); // Reset category to default 'Book'
      })
      .catch((error) => {
        console.error('Failed to create list', error);
      });
  };

  // Handle deleting a custom list
  const handleDeleteList = (listId: number) => {
    setDeleteDialogOpen(true);
    setListToDelete(listId);
  };

  // Confirm deletion
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

  // Handle updating a custom list
  const handleOpenEditDialog = (list: CustomList) => {
    setEditListId(list.id);
    setEditListName(list.name);
  };

  const handleUpdateList = () => {
    if (!editListName.trim() || editListId === null) return;

    updateCustomList(editListId, { name: editListName, items: [] })
      .then((response) => {
        setCustomLists(
          customLists.map((list) =>
            list.id === editListId
              ? { ...list, name: response.data.name }
              : list
          )
        );
        setEditListId(null);
        setEditListName('');
      })
      .catch((error) => {
        console.error('Failed to update list', error);
      });
  };

  return (
    <Box className="p-4 min-h-screen flex flex-col items-center dark:bg-dark-300">
      <Typography
        variant="h4"
        component="h2"
        color="primary"
        className="font-bold mb-4"
      >
        Custom Lists
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
      >
        Create New List
      </Button>

      <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4 w-full">
        {loading ? (
          <CircularProgress />
        ) : (
          customLists.map((list) => (
            <Card
              key={list.id}
              className="shadow-md dark:bg-dark-300 z-10"
              onClick={() => navigate(`/lists/${list.id}`)}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  className="font-bold mb-2"
                >
                  {list.name}
                </Typography>
                <Typography color="text.secondary">
                  {list.items.length} items
                </Typography>
                <Box className="mt-2 flex justify-between">
                  <IconButton
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent card click
                      handleOpenEditDialog(list);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent card click
                      handleDeleteList(list.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditListId(null);
              setEditListName('');
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
