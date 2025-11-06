
import { useState, useEffect } from 'react';

interface Coords {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  coords: Coords | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    coords: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({ ...prevState, loading: false }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error,
        coords: null,
      });
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

  }, []);

  return state;
};
