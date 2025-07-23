import { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress, Paper, Box, Typography } from '@mui/material';
import type { User } from '../types/User';
import { formatUserDisplay, sortUsersByLastName } from '../utils/userUtils';

export const UserSearch = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  useEffect(() => {
    let active = true;

    if (!open) {
      return undefined;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        
        if (active) {
          // Sort users alphabetically by last name
          const sortedUsers = sortUsersByLastName(data);
          setOptions(sortedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      active = false;
    };
  }, [open]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Search
      </Typography>
      
      <Autocomplete
        id="user-search"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(option) => formatUserDisplay(option)}
        onChange={(_, newValue) => setSelectedUser(newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a user"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {selectedUser && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {formatUserDisplay(selectedUser)}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Address:
          </Typography>
          
          <Typography variant="body1">
            {selectedUser.address.street}, {selectedUser.address.suite}
          </Typography>
          <Typography variant="body1">
            {selectedUser.address.city}, {selectedUser.address.zipcode}
          </Typography>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
            User ID: {selectedUser.id}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
