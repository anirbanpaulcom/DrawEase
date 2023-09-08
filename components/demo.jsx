import React from 'react';
import { StyleSheet, View ,Image, Text,TouchableOpacity,StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackIcon from "../assets/icons/left-arrow.png"



export default function Demo() {

  const navigation = useNavigation();

  return (
    <SafeAreaProvider style={styles.demo}>
        <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        hidden={false}
        translucent={true}
        zIndex={1000}
      />
      <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
        <Image source={BackIcon} style={styles.iconPng} />
      </TouchableOpacity>
        <View style={styles.video}>
          <View style={{ width:"75%",height:"85%", backgroundColor:"black", borderRadius:20}}></View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Edit')} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
  
}

const styles = StyleSheet.create({
  demo:{
     backgroundColor:"white",
     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
  container:{
    flex:1
  },
  video:{
    flex:1,
    marginTop:30,
    alignItems:"center"
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
    backgroundColor: "white",
  },
  iconPng: {
    width: 50,
    height: 50,
  }
})