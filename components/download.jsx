import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Alert, SafeAreaView, StatusBar } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import BackIcon from "../assets/icons/left-arrow.png"

export default function Download() {
  const navigation = useNavigation();
  const [selectedImageSrc, setSelectedImageSrc] = useState('');
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {

    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();

    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://www.google.com', { method: 'HEAD' });
        setIsConnected(response.status === 200);
      } catch (error) {
        setIsConnected(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  if (hasMediaLibraryPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasMediaLibraryPermission) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={styles.permissionDeniedText}>
           Gallery permission is required to save the image.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.permissionButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleImageDownload = async () => {
    if (!selectedImageSrc) {
      Alert.alert('Opps.', 'Please select an image.');
      return;
    }

    try {
      const downloadResult = await FileSystem.downloadAsync(
        selectedImageSrc,
        FileSystem.documentDirectory + 'downloaded_image.jpg'
      );

      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        console.log('Image downloaded and saved successfully');
      } else {
        console.log('Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading and saving image:', error);
    } finally {
      setSelectedImageSrc('');
      navigation.navigate('Camera', { imageUri: selectedImageSrc });
    }
  };

  const injectedJavaScript = `
    (function() {
      const images = document.querySelectorAll('img[src^="https://encrypted-tbn0.gstatic.com/"]');
      
      for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', function(event) {
          event.preventDefault();
          const imgSrc = images[i].getAttribute('src');
          
          if (imgSrc) {
            window.ReactNativeWebView.postMessage(imgSrc);
          }
        });
      }
    })();
  `;

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        hidden={false}
        translucent={true}
        zIndex={1000}
      />

      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
        <Image source={BackIcon} style={styles.iconPng} />
      </TouchableOpacity>

      {isConnected ? (
        <View style={styles.browser}>
          <WebView
            source={{ uri: 'https://www.google.com/search?q=line%20drawing%20portrait&tbm=isch' }}
            injectedJavaScript={injectedJavaScript}
            onMessage={(event) => {
              const imageSrc = event.nativeEvent.data;

              if (imageSrc) {
                setSelectedImageSrc(imageSrc);
              }
            }}
            onError={() => setIsConnected(false)}
          />

          {selectedImageSrc ? (
            <TouchableOpacity onPress={handleImageDownload} style={styles.download}>
              <Text style={styles.downloadText}>Start Drawing</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleImageDownload} style={[styles.download, {backgroundColor: 'pink' }]}>
              <Text style={styles.downloadText}>You haven't chosen any image</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[styles.container, { alignItems: 'center' }]}>
          <Text style={{ fontSize: 15 }}>Internet connection lost. Please check your connection.</Text>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  browser: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  download: {
    backgroundColor: 'black',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom:10,
    borderRadius: 15,
  },
  downloadText: {
    color: 'white',
    fontSize: 15,
    fontWeight: "300",
  },
  back: {
    backgroundColor: "white"
  },
  iconPng: {
    width: 50,
    height: 50,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
  },
  permissionDeniedText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: 'black', 
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF', 
    borderRadius: 5,
  },
  permissionButtonText: {
    fontSize: 16,
    color: 'white', 
  }
});
