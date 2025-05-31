import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(isDeviceLandscape());

  useEffect(() => {
    const handleChange = ({ window }) => {
      setIsLandscape(window.width > window.height);
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove?.(); // for newer RN
      Dimensions.removeEventListener?.('change', handleChange); // fallback
    };
  }, []);

  return (
    <OrientationContext.Provider value={{ isLandscape }}>
      {children}
    </OrientationContext.Provider>
  );
};

const isDeviceLandscape = () => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

export const useOrientation = () => useContext(OrientationContext);
