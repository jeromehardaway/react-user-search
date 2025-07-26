import { Box, Paper, Typography } from '@mui/material';
import { useMap } from '../hooks/useMap.js';
import type { Geo } from '../types/User.js';

interface UserMapProps {
  geo: Geo | null;
  address: string;
}

export const UserMap = ({ geo, address }: UserMapProps) => {
  const { mapRef, status } = useMap(geo);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mt: 3, 
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Box 
        ref={mapRef} 
        sx={{ 
          height: 250, 
          width: '100%',
          position: 'relative',
        }}
      >
        {status === 'loading' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <Typography variant="body2">Loading map...</Typography>
          </Box>
        )}
        
        {status === 'error' && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="body2" color="error">
              Could not load map
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Location
        </Typography>
        <Typography variant="body2">{address}</Typography>
      </Box>
    </Paper>
  );
};
