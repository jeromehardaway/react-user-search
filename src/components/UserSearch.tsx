import { useState } from "react";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Paper,
  Box,
  Typography,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import type { User } from "../types/User";
import { getInitials, formatUserDisplay } from "../utils/userUtils";
import { useUsers } from "../hooks/useUsers";
import { useDebounce } from "../hooks/useDebounce";
import { getColorFromString } from "../utils/userUtils";

export const UserSearch = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const debouncedInput = useDebounce(inputValue, 300);

  const { users, loading, error } = useUsers();

  const filteredUsers = users.filter((user) =>
    formatUserDisplay(user).toLowerCase().includes(debouncedInput.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
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
renderOption={(props, Option) => {
  const color = getColorFromString(Option.name);
  console.log('Name:', Option.name, 'Color:', color);

  return (
    <li {...props} key={Option.id}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: color,
            color: 'white',
          }}
        >
          {getInitials(Option.name)}
        </Avatar>
        <Typography>{formatUserDisplay(Option)}</Typography>
      </Box>
    </li>
  );
}}
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
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {selectedUser && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getColorFromString(Option.name),
                color: "white",
              }}
            >
              {getInitials(Option.name)}
            </Avatar>
            <Typography variant="h5">
              {formatUserDisplay(selectedUser)}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Address:
          </Typography>

          <Typography variant="body1">
            {selectedUser.address.street}, {selectedUser.address.suite}
          </Typography>
          <Typography variant="body1">
            {selectedUser.address.city}, {selectedUser.address.zipcode}
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 2, color: "text.secondary" }}
          >
            User ID: {selectedUser.id}
          </Typography>
        </Paper>
      )}

      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
