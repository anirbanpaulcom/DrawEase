import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './camera';
import Download from './download';
import Demo from './demo';
import EditIcon from '../assets/icons/sketch.png';
import BrowserIcon from '../assets/icons/google.png';
import DemoIcon from '../assets/icons/play-button.png';
import EditScreen from './edit';
import CoverImage from '../assets/icons/cover.jpg';
import Icon from '../assets/icon.png';

import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'AbrilFatface': require('../assets/fonts/AbrilFatface-Regular.ttf'),
    'Monoton': require('../assets/fonts/Monoton-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={styles.home}>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        hidden={false}
        translucent={true}
        zIndex={1000}
      />

      <View style={styles.container}>
        <View
          style={{
            backgroundColor: 'black',
            borderBottomLeftRadius: 60,
            width: '100%',
            height: '100%',
          }}
        >
          <View style={styles.title}>
          <Image
              source={Icon}
              style={{ marginStart:15,width:35, height:35}}
            />
            <Text style={styles.titleText}>DrawEase</Text>
          </View>

          <View style={styles.coverImage}>
            <Image
              source={CoverImage}
              style={styles.backgroundImage}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.option}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Edit')}
              style={styles.button}
            >
              <Image
                source={EditIcon}
                style={[
                  styles.iconPngHover,
                  { backgroundColor: 'black', borderRadius: 10 },
                ]}
              />
              <Text style={styles.boxText}>Sketch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Download')}
              style={styles.button}
            >
              <Image source={BrowserIcon} style={styles.iconPngHover} />
              <Text style={styles.boxText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Demo')}
              style={[styles.button, { marginEnd: 20 }]}
            >
              <Image source={DemoIcon} style={styles.iconPngHover} />
              <Text style={styles.boxText}>Demo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View style={[styles.canvas]}>
        <View style={{ width: '80%', height: '55%' }}>
          <Text style={{ color: 'black', fontFamily: 'Monoton', fontSize: 25 }}>
            Start
          </Text>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Monoton',
              fontSize: 25,
            }}
          >
            Your   drawing    with
          </Text>
          <Text style={{ color: 'red', fontFamily: 'Monoton', fontSize: 25 }}>
            DrawEase
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Camera')}
          style={[styles.draw]}
        >
          <Text style={[styles.boxText, { color: 'white', paddingTop: 0 }]}>
            Start Drawing
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

export default function Home() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Download"
          component={Download}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Demo"
          component={Demo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor:'black' ,
    color:'#000000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  coverImage: {
    justifyContent:"center",
    alignItems:"center",
    height:"35%",
    marginBottom:50
  },
  backgroundImage:{
    width:"90%",
    height:"100%"
  },
  title: {
    marginTop:10,
    flexDirection:"row",
    alignItems:"center"
  },
  titleText:{
    color:'white',
    fontFamily:'AbrilFatface',
    fontSize: 30
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor:"white",
    height:"62%",
  },
  canvas:{
    height:"35%",
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    borderTopRightRadius:60,
    borderBottomLeftRadius:60,
    borderBottomWidth:15,
  },
  draw: {
    backgroundColor: 'black',
    paddingHorizontal:40,
    paddingVertical:20,
    borderRadius:25,
    margin:5
  },
  button: {
    color:'#ffffff',
    backgroundColor: '#fffffff5',
    width:120,
    height:120,
    borderRadius: 20,
    borderColor: '#c0bebe', 
    justifyContent: 'center',
    alignItems: 'center',
    marginStart:20
  },
  boxText:{
    color:'black',
    fontWeight:"300",
    paddingTop:3
  },
  iconPngHover:{
    width: 50,
    height: 50,
  },
});


