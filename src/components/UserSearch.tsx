import { useState } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import type { User } from '../types/User';
import { formatUserDisplay } from '../utils/userUtils';
import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';

export const UserSearch = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 300);

  const { users, loading, error } = useUsers();

  const filteredUsers = users.filter((user) =>
    formatUserDisplay(user).toLowerCase().includes(debouncedInput.toLowerCase())
  );

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
        options={filteredUsers}
        loading={loading}
        inputValue={inputValue}
        onInputChange={(_, newValue) => setInputValue(newValue)}
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

      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};