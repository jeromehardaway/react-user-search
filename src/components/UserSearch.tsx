import { useState, useEffect, useCallback } from "react";
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
  Button,
  Skeleton,
  Divider,
  Fade,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import type { User } from "../types/User.js";
import { getInitials, formatUserDisplay, getColorFromString } from "../utils/userUtils.js";
import { useUsers } from "../hooks/useUsers.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { KeyboardNavigableList } from "./KeyboardNavigableList.js";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';

export const UserSearch = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedInput = useDebounce(inputValue, 300);

  const { users, loading, error } = useUsers();

  const filteredUsers = users.filter((user) =>
    formatUserDisplay(user).toLowerCase().includes(debouncedInput.toLowerCase())
  );

  const handleItemSelect = useCallback((index: number) => {
    if (index >= 0 && index < filteredUsers.length) {
      setSelectedIndex(index);
      setSelectedUser(filteredUsers[index]);
    }
  }, [filteredUsers]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredUsers.length]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Fade in={true} timeout={800}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          User Directory
        </Typography>
      </Fade>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Find a User
          </Typography>
        </Box>

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
          filterOptions={(x) => x}
          blurOnSelect
          clearOnBlur={false}
          selectOnFocus
          handleHomeEndKeys
          renderOption={(props, option, { index }) => {
            const color = getColorFromString(option.name, isDarkMode);
            const isSelected = selectedIndex === index;
            
            return (
              <li 
                {...props} 
                key={option.id} 
                id={`user-search-listbox-item-${index}`}
                data-option-index={index}
                className={isSelected ? "Mui-focused" : ""}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: color,
                      color: 'white',
                    }}
                  >
                    {getInitials(option.name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{formatUserDisplay(option)}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {option.email}
                    </Typography>
                  </Box>
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
                startAdornment: (
                  <SearchIcon color="action" sx={{ ml: 1, mr: 0.5 }} />
                ),
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              placeholder="Start typing a name..."
              helperText="Search by name, email, or company"
            />
          )}
          ListboxComponent={(props) => (
            <KeyboardNavigableList
              listId="user-search-listbox"
              onItemSelect={handleItemSelect}
              selectedIndex={selectedIndex}
              itemCount={filteredUsers.length}
              itemSelector="[role='option']"
            >
              <ul {...props} />
            </KeyboardNavigableList>
          )}
          ListboxProps={{
            style: {
              maxHeight: '300px',
              overflow: 'auto',
              padding: '8px 0',
            },
          }}
        />

        {filteredUsers.length > 0 && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
          </Typography>
        )}
      </Paper>

      {selectedUser ? (
        <Fade in={!!selectedUser} timeout={500}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: getColorFromString(selectedUser.name, isDarkMode),
                  color: "white",
                  fontSize: '1.5rem',
                }}
              >
                {getInitials(selectedUser.name)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                  {formatUserDisplay(selectedUser)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  @{selectedUser.username}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography>
                  <strong>Phone:</strong> {selectedUser.phone}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon color="primary" />
                <Typography>
                  <strong>Company:</strong> {selectedUser.company.name}
                </Typography>
                <Chip 
                  label={selectedUser.company.bs} 
                  size="small" 
                  sx={{ ml: 1 }} 
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography>
                    <strong>Address:</strong>
                  </Typography>
                  <Typography>
                    {selectedUser.address.street}, {selectedUser.address.suite}
                  </Typography>
                  <Typography>
                    {selectedUser.address.city}, {selectedUser.address.zipcode}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedUser(null)}
                sx={{ mr: 1 }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                component="a" 
                href={`https://${selectedUser.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </Button>
            </Box>
          </Paper>
        </Fade>
      ) : (
        <Box sx={{ my: 4, p: 3 }}>
          {loading ? (
            <>
              <Skeleton variant="text" sx={{ mb: 1 }} height={40} width="60%" />
              <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" sx={{ mb: 1 }} height={20} width="40%" />
              <Skeleton variant="text" sx={{ mb: 1 }} height={20} width="70%" />
              <Skeleton variant="text" sx={{ mb: 1 }} height={20} width="50%" />
            </>
          ) : (
            <Typography 
              variant="body1" 
              color="text.secondary"
              align="center"
            >
              Search for a user above to view their details
            </Typography>
          )}
        </Box>
      )}

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: "100%" }} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};