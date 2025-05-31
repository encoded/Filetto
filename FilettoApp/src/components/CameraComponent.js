import { useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import TextBase from './base/TextBase';
import { Ionicons } from '@expo/vector-icons'; // 👈 import your icon pack

export default function CameraComponent({ onBarcodeScanned }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scannedBarcode) {
        setScannedBarcode(null); // Reset if not detected for 5 seconds
      }
    }, 5000);
  
    return () => clearTimeout(timeout);
  }, [scannedBarcode]);

  if (!permission) {
    // Camera permissions are still loading.
    return <TextComponent style={styles.message}>No camera found</TextComponent>;
  }

  if (!permission.granted) {
    requestPermission();
    return (
      <View/>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarcodeScanned = ({ bounds, cornerPoints, data, type }) => {
    setScannedBarcode({ bounds, cornerPoints, data, type });
  };  

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
          isGuidanceEnabled: true,
          isHighlightingEnabled: true,
          isPinchToZoomEnabled: true
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={36} color="white" />
        </TouchableOpacity>
      </View>

      {scannedBarcode && (
          <TouchableOpacity
            onPress={() => onBarcodeScanned(scannedBarcode)}
            style={styles.barcodeScannedOverlay}
          >
            <TextBase style={{ color: 'black', fontWeight: 'bold' }}>Proceed with "{scannedBarcode.data}"</TextBase>
          </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
    margin: 24
  },
  barcodeScannedOverlay: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    margin: 24
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }
});
