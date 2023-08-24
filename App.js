import { SafeAreaProvider } from 'react-native-safe-area-context';
import  'react-native-reanimated';
import 'react-native-gesture-handler';
import Home from './components/home';

export default function App() {
  return (
    
    <SafeAreaProvider style={{ flex: 1 }}>
       <Home/>
    </SafeAreaProvider> 
  );
}