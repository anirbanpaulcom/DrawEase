import React, { useState, useRef,useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library'; 
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackIcon from "../assets/icons/left-arrow.png"

export default function EditScreen() {
  const [webViewVisible, setWebViewVisible] = useState(true);
  const [fileSelect, setFileSelect] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const viewShotRef = useRef(React.createRef());



  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
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



  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      <title>edit</title>
    <style>
  body, html {
    margin: 0;
    padding: 0;
    height: 100%; 
    overflow: hidden; 
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%; 
  }
  .imgWrap {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 85%; 
    color:white;
  } 
  .img {
    width: auto; 
    height: auto; 
    max-width: 100%;
    max-height: 100%; 
  }
  .manual {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items:center;
    height: 15%;
    background-color:white;
  }
  .fileChoose{
    padding:30px;
    background-color:pink;
    border-radius:20px;
    color:white;
    font-weight:300;
  }
  #imageInput {
    display:none;
  }
  .filter{
    height:90%;
    width:100%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
  }
  .slider{
    width:75%;
    display: flex;
    justify-content: center;
    align-items:center;
    margin:5px;
    font-weight:300;
  }
  .line-art {
    filter: url(#line-art) url(#sharpen-filter);
  }
  .slider input[type="range"] {
    width: 100%; 
    height: 7px; 
    -webkit-appearance: none; 
    appearance: none;
    background: #d3d3d3; 
    outline: none; 
    border-radius: 5px; 
}
.slider input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; 
    appearance: none;
    width: 20px; 
    height: 20px; 
    background: black; 
    border-radius: 50%; 
    cursor: pointer; 
  }
.slider input[type="range"]::-moz-range-thumb {
  width: 20px; 
  height: 20px; 
  background: #4caf50; 
  border-radius: 50%; 
  cursor: pointer; 
}
</style>
    </head>
    <body>
<div class="container">
  <div class="imgWrap">
    <img id="selectedImage" src="" class="img line-art">
    <label id="selectImageLabel" class="fileChoose" for="imageInput">Select an image</label>
    <input type="file" id="imageInput" accept="image/*">
  </div>
  <div class="manual">
    <div class="filter">
      <div class="slider">Thick: <input id="gaussianBlurSlider" type="range" min="1" max="50" step="any"></div>
      <div class="slider">Sharpe: <input id="sharpenSlider" type="range" min="8.5" max="20" step="any"></div>
    </div>
  </div> 
</div>
      <svg>
        <defs>
          <filter width="100" height="100" id="line-art" color-interpolation-filters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="-1 0 0 0 1
                                                                  0 -1 0 0 1
                                                                  0 0 -1 0 1
                                                                  0 0 0 1 0" result="inverted" />
            <feGaussianBlur id="gaussianBlur" in="inverted" stdDeviation="10" result="inverted-blurred" />
            <feBlend in="SourceGraphic" in2="inverted-blurred" mode="color-dodge" result="colorDodge" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="sharpen-filter">
            <feConvolveMatrix id="sharpen" order="3" kernelMatrix="-1 -1 -1 -1 8.5 -1 -1 -1 -1" />
          </filter>
        </defs>
      </svg>
      
      <script>
        var blurSlider = document.querySelector("#gaussianBlurSlider");
        var blur = document.querySelector("#gaussianBlur");
        var sharpenSlider = document.querySelector("#sharpenSlider");
        var sharpen = document.querySelector("#sharpen");
        var imageInput = document.querySelector("#imageInput");
        var selectedImage = document.querySelector("#selectedImage");

        sharpenSlider.value = 28.5 - 10;
        blurSlider.value = blur.getAttribute("stdDeviation");

        blurSlider.oninput = blurSlider.onchange = function () {
          blur.setAttribute("stdDeviation", this.value);
        };

        sharpenSlider.oninput = sharpenSlider.onchange = function () {
          sharpen.setAttribute("kernelMatrix", \`-1 -1 -1 -1 \${28.5 - this.value} -1 -1 -1 -1\`);
        };

        imageInput.addEventListener("change", function (event) {
          var file = event.target.files[0];
          if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
              selectedImage.src = e.target.result;
              checkImageSelected();
              var selectImageLabel = document.querySelector("#selectImageLabel");
              if (selectImageLabel) {
                selectImageLabel.style.display = "none";
              }
            };
            reader.readAsDataURL(file);
          }
        });

        selectedImage.onclick = function () {
          this.classList.toggle("line-art");
        };
          
        function checkImageSelected() {
          if (selectedImage.src) {
            window.ReactNativeWebView.postMessage("imageSelected");
          } else {
            window.ReactNativeWebView.postMessage("imageNotSelected");
          }
        }
      </script>
    </body>
    </html>
  `;

    const hideManualDiv = () => {
      const jsCode = `
        document.querySelector(".manual").style.display = "none";
      `;
      webViewRef.current.injectJavaScript(jsCode);
    };
  
    const captureScreenshot = async () => {
      try {
        if (webViewRef.current && fileSelect) {
          hideManualDiv();
          await new Promise(resolve => setTimeout(resolve, 10));
          viewShotRef.current.capture({ format: 'jpg', quality: 1 }).then(async (uri) => {
            await MediaLibrary.saveToLibraryAsync(uri);
            setWebViewVisible(true);
            navigation.navigate('Camera', { imageUri: uri });
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
  
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
  
        {webViewVisible && (
          <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={false}
              style={styles.web}
              onMessage={(event) => {
                if (event.nativeEvent.data === "imageSelected") {
                  setFileSelect(true);
                } else if (event.nativeEvent.data === "imageNotSelected") {
                  setFileSelect(false);
                }
              }}
            />
          </ViewShot>
        )}
  
        <TouchableOpacity onPress={captureScreenshot} style={styles.button}>
          <Text style={styles.buttonText}>Start Drawing</Text>
        </TouchableOpacity>
      </SafeAreaProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    web: {
      flex: 1,
    },
    button: {
      backgroundColor: 'black',
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 30,
      marginBottom:10,
      borderRadius: 15,
    },
    buttonText: {
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
  