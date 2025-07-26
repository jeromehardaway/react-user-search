import { useEffect, useRef, useState } from 'react';
import type { Geo } from '../types/User.js';

type MapStatus = 'idle' | 'loading' | 'ready' | 'error';

// Define interfaces for Google Maps objects
interface GoogleMap {
  setCenter: (location: { lat: number; lng: number }) => void;
}

interface GoogleMarker {
  setPosition: (location: { lat: number; lng: number }) => void;
  setMap: (map: GoogleMap | null) => void;
}

// Adding type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: {
          new(element: HTMLElement, options: object): GoogleMap;
        };
        Marker: {
          new(options: object): GoogleMarker;
        };
        Animation: {
          DROP: number;
        }
      }
    }
  }
}

export const useMap = (geo: Geo | null) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<MapStatus>('idle');
  const [mapObject, setMapObject] = useState<GoogleMap | null>(null);
  const [marker, setMarker] = useState<GoogleMarker | null>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current || !geo) return;
    
    setStatus('loading');
    
    try {
      const { lat, lng } = geo;
      const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
      
      // Create map if it doesn't exist
      if (!mapObject) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
        });
        setMapObject(map);
        
        // Create marker
        const newMarker = new window.google.maps.Marker({
          position: location,
          map,
          animation: window.google.maps.Animation.DROP,
        });
        setMarker(newMarker);
      } else {
        // Update existing map and marker
        mapObject.setCenter(location);
        if (marker) {
          marker.setPosition(location);
        }
      }
      
      setStatus('ready');
    } catch (error) {
      console.error('Error initializing map:', error);
      setStatus('error');
    }
  }, [geo, mapObject, marker]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  return { mapRef, status };
};
