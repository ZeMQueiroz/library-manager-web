// src/components/AddMediaModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
} from '@mui/material';

interface AddMediaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    status: string;
    notes: string;
    category: string;
  }) => void;
}

const AddMediaModal: React.FC<AddMediaModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [newMedia, setNewMedia] = useState({
    title: '',
    status: '',
    notes: '',
    category: '',
  });

  // Log changes to debug the state
  console.log('Current Media State:', newMedia);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setNewMedia({ ...newMedia, [name!]: value });
  };

  const handleSubmit = () => {
    onSubmit(newMedia);
    setNewMedia({ title: '', status: '', notes: '', category: '' });
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

    if (newMedia.category === '2') {
      // Anime category
      options = [
        <MenuItem key="To Watch" value="To Watch">
          To Watch
        </MenuItem>,
        <MenuItem key="Watching" value="Watching">
          Watching
        </MenuItem>,
        ...options,
      ];
    } else if (newMedia.category === '1') {
      // Book category
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add New Media</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiFormControl-root': {
              mb: 2,
              width: '100%',
            },
            '& .MuiInputLabel-outlined': {
              zIndex: 1,
            },
            '& .MuiOutlinedInput-root': {
              position: 'relative',
            },
          }}
        >
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newMedia.category}
              onChange={handleChange}
              label="Category"
              MenuProps={{
                PaperProps: { sx: { maxHeight: 200, width: 'auto' } },
              }}
            >
              <MenuItem value="1">Book</MenuItem>
              <MenuItem value="2">Anime</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={newMedia.title}
            onChange={handleChange}
            variant="outlined"
          />
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newMedia.status}
              onChange={handleChange}
              label="Status"
              MenuProps={{
                PaperProps: { sx: { maxHeight: 200, width: 'auto' } },
              }}
            >
              {getStatusOptions()}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            name="notes"
            value={newMedia.notes}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Media
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMediaModal;
