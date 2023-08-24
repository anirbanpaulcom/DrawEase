import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Modal, View, TextInput, TouchableOpacity, StatusBar, SafeAreaView, Text, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'; 
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import LockOpenIcon from '../assets/icons/padlock-unlock.png';
import LockOffIcon from '../assets/icons/secured-lock.png';
import FlashOffIcon from '../assets/icons/flashoff.png';
import FlashOnIcon from '../assets/icons/flashon.png';
import RecordingOnIcon from '../assets/icons/stop-button.png';
import RecordingOffIcon from '../assets/icons/rec-button.png';
import TextIcon from '../assets/icons/text.png';
import SaveIcon from '../assets/icons/bookmark.png';
import ZoomIcon from '../assets/icons/search.png';
import OpacityIcon from '../assets/icons/overlapping-circles.png';
import GalleryIcon from '../assets/icons/image-gallery.png';

export default function CameraScreen() {
  const route = useRoute();
  const imageUri = route.params?.imageUri;

  const [isLocked, setIsLocked] = useState(false);
  const [image, setImage] = useState(imageUri ? imageUri : null);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [selectedFont, setSelectedFont] = useState('');
  const [text, setText] = useState(null);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf'),
        'Cinzel-VariableFont_wght': require('../assets/fonts/Cinzel-VariableFont_wght.ttf'),
        'DancingScript-Bold': require('../assets/fonts/DancingScript-Bold.ttf'),
        'Monoton-Regular': require('../assets/fonts/Monoton-Regular.ttf'),
        'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
        'TiltPrism-Regular': require('../assets/fonts/TiltPrism-Regular.ttf'),
      });
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
  };
  

  let cameraRef = useRef();
  const navigation = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      loadFonts();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMediaLibraryPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission || !hasMediaLibraryPermission) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={styles.permissionDeniedText}>
          Camera and Gallery permissions are required to use this app.
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


  const toggleFlash = () => {
    try {
      setFlashMode(
        flashMode === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.torch
          : Camera.Constants.FlashMode.off
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const recordVideo = async () => {
    if (isRecording) {
      return;
    }
    try {
      setIsRecording(true);
      let options = {
        quality: "1080p",
        maxDuration: 60,
        mute: true,
      };
      const recordedVideo = await cameraRef.current.recordAsync(options);
      setVideo(recordedVideo);
    } catch (error) {
      console.error("Error recording video:", error);
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    try {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };
  
  const saveVideo = async () => {
    try {
      if (video) {
        await MediaLibrary.saveToLibraryAsync(video.uri);
        setVideo(undefined);
      }
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };
  
  const openTextModal = () => {
    setTextModalVisible(true);
  };
  
  const closeTextModal = () => {
    setTextModalVisible(false);
  };
  
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };
  
  const handleText = (data) => {
    setText(data.textInputValue);
    setSelectedFont(data.selectedFonts);
  };
  
  const LockModal = ({ visible, onClose }) => {
    return (
      <Modal transparent={true} visible={visible} onRequestClose={onClose} style={styles.lockModal}>
        <View style={styles.navBox}>
          <View style={styles.nav}>
            <TouchableOpacity onPress={toggleLock} style={[styles.icon]}>
              <Image source={LockOffIcon} style={[styles.iconPng, { tintColor: "red" }]} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" hidden={false} translucent={true} zIndex={1000} />
      <Camera style={styles.camera} type={Camera.Constants.Type.back} flashMode={flashMode} ref={cameraRef} ratio="16:9">
        <View style={styles.navBox}>
          <View style={styles.nav}>
            {!video && (
              <TouchableOpacity
                style={styles.icon}
                onPress={isRecording ? stopRecording : recordVideo}
              >
                {isRecording ? (
                  <Image source={RecordingOnIcon} style={[styles.iconPng, { tintColor: "red" }]} />
                ) : (
                  <Image source={RecordingOffIcon} style={styles.iconPng} />
                )}
              </TouchableOpacity>
            )}
            {hasMediaLibraryPermission && video ? (
              <TouchableOpacity onPress={saveVideo} style={styles.icon}>
                <Image source={SaveIcon} style={styles.iconPng} />
              </TouchableOpacity>
            ) : undefined}
  
            <TouchableOpacity onPress={toggleFlash} style={styles.icon}>
              {flashMode === Camera.Constants.FlashMode.off ? (
                <Image source={FlashOffIcon} style={styles.iconPng} />
              ) : (
                <Image source={FlashOnIcon} style={[styles.iconPng, { tintColor: "#f7c24e" }]} />
              )}
            </TouchableOpacity>
  
            <TouchableOpacity onPress={openTextModal} style={styles.icon}>
              <Image source={TextIcon} style={styles.iconPng} />
            </TouchableOpacity>
  
            <TouchableOpacity onPress={toggleLock} style={styles.icon}>
              <Image source={LockOpenIcon} style={styles.iconPng} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
  
      {(!image && !text) && (
        <TouchableOpacity onPress={() => pickImage()} style={styles.file}>
          <Image source={GalleryIcon} style={styles.galleryIcon} />
        </TouchableOpacity>
      )}
  
      <TextModal visible={textModalVisible} onClose={closeTextModal} onData={handleText} />
  
      {(image || text) && <MyImage image={image} text={text} selectedFont={selectedFont} />}
  
      <LockModal visible={isLocked} onRequestClose={isLocked} />
  
    </SafeAreaProvider>
  );
}
const MyImage = ({ image, text,  selectedFont})=> {
try{
  const [opacity, setOpacity] = useState(1);
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const textSize = useSharedValue(20);

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      x.value = ctx.startX + translationX;
      y.value = ctx.startY + translationY;
    },
  });

  const onPinchGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.initialScale = scale.value;
    },
    onActive: ({ scale: pinchScale }, ctx) => {
      const newScale = ctx.initialScale * pinchScale;
      scale.value = withSpring(newScale, { damping: 10, stiffness: 100 });
      textSize.value = 20 * scale.value;
    },
  })
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity,
  }));

  const handleOpacityChange = (value) => {
      setOpacity(value);
  };

  const handleZoomChange = (value) => {
    scale.value = withSpring(value, { damping: 10, stiffness: 100 });
    textSize.value = 20 * value;
  };


  return (
    <View>
      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={onPanGestureEvent}>
            {image ? (
              <Animated.Image source={{ uri: image }} style={[styles.componentStyle, animatedStyle]}  resizeMode="contain"/>
            ) : (
              <Animated.View style={[styles.componentStyle, animatedStyle]}  resizeMode="contain">
                <Text style={[styles.textComponent, { fontFamily: selectedFont }]}>{text}</Text>
              </Animated.View>
            )}
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderComponent}>
         <Image source={ZoomIcon} style={styles.sliderIcon} />
        <Slider
          style={styles.slider}
          value={scale.value}
          onValueChange={handleZoomChange}
          minimumValue={0.5} 
          maximumValue={3}   
          step={0.1}
          thumbTintColor="black"
          minimumTrackTintColor="white" 
        />

        </View>

        <View style={styles.sliderComponent}>

        <Image source={OpacityIcon} style={styles.sliderIcon} />

        <Slider
          style={styles.slider}
          value={opacity}
          onValueChange={handleOpacityChange}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          thumbTintColor="black"
          minimumTrackTintColor="white"
        />
        </View>
      </View>
    </View>
  )}catch (error) {
  console.error(error);
}}


const TextModal = ({ visible, onClose, onData }) => {

try{
  const FONT_OPTIONS = [
    'AbrilFatface-Regular',
    'Cinzel-VariableFont_wght',
    'DancingScript-Bold',
    'Monoton-Regular',
    'PressStart2P-Regular',
    'TiltPrism-Regular',
  ];
  
    const [textInputValue, setTextInputValue] = useState('');
    const [selectedFonts, setSelectedFonts] = useState('');
 
    const done = () => {
      onData({ textInputValue, selectedFonts });
      onClose()
    };
    
  return (

      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose} style={styles.textModalContainer}>
        <TouchableOpacity  style={styles.doneButton} onPress={done}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, {  fontFamily: selectedFonts }]}
          placeholder="Add Text"
          placeholderTextColor="white"
          value={textInputValue}
          onChangeText={setTextInputValue}
        />
          <View style={styles.fontContainer}>
            {FONT_OPTIONS.map((fontOption, index) => (
              <TouchableOpacity
                key={index}
                style={styles.fontOption}
                onPress={() => setSelectedFonts(fontOption)}
              >
                <Text style={{ fontFamily: fontOption, color:"white" }}>Tt</Text>
              </TouchableOpacity>
            ))}
          </View>
      </Modal>
    )}catch(error){
      console.error(error);
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    camera: {
      flex: 1,
    },
    navBox:{
       flex:0,
       alignItems: "flex-end",
    },
    nav:{
      flexDirection:"row",
      padding:5,
      margin:10,
      borderRadius: 15,
      backgroundColor: 'white',
    },
    icon: {
      borderRadius: 5,
      color: 'black',
      flex:0,
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      height: 45, 
    },
    iconPng:{
      width: 30,
      height: 30,
    },
    iconPngHover:{
      width: 30,
      height: 30,
    }, 
    file: {
      position: 'absolute',
      top:'40%',
      alignSelf: 'center',
      padding: 5,
      borderRadius: 20,
    },
    galleryIcon:{
      width: 150,
      height: 150,
    },
    componentStyle: {
      width:400,
      height:400,
      position: 'absolute',
      bottom: 200,
    },
    textComponent:{
      fontSize: 50,
      color: 'white',
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
      },
      sliderComponent: {
        width: '100%',
        paddingVertical:10,
        flex:0,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:'row'
      },
      slider: {
        width: '95%',
        paddingTop:5,
      },
      sliderIcon:{
        width: 28,
        height: 28,
      },
      lockModal :{
        flex: 1,
      },
      locked:{
        position: 'absolute',
      },     
      textModalContainer: {
        flex: 1,
      },
      textInput: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal:100,
        color:"white"
      },
      fontContainer: {
        flex: 0.7,
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      fontOption: {
        backgroundColor: '#ffaf00',
        margin:2,
        fontSize:10,
        height: 45,
        width: 45,
        borderRadius:15,
        flex: 0,
        justifyContent: 'center', 
        alignItems: 'center',
      },
      doneButton: {
        flex: 0,
        justifyContent: 'flex-end',
        alignItems:'flex-end',
        width:"100%",
        paddingHorizontal: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      doneText:{
        color:"white", fontWeight:"900", fontSize:15 
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
