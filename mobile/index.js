import 'react-native-gesture-handler'; // ◄ OBLIGATOIREMENT EN LIGNE 1
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
