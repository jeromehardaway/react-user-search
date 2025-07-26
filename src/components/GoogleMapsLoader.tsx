import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface GoogleMapsLoaderProps {
  apiKey: string;
  children: React.ReactNode;
}

export const GoogleMapsLoader = ({ apiKey, children }: GoogleMapsLoaderProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    script.onload = () => {
      setLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const scriptElement = document.getElementById('google-maps-script');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [apiKey]);

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!loaded) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading maps...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};
