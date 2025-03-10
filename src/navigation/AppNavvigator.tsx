import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import ObjectSelectScreen from "../screens/ObjectSelectScreen";
import DetectScreen from "../screens/DetectScreen";
import LoadingScreen from "../screens/LoadingScreen";

export type RootStackParamList = {
  Home: undefined;
  ObjectSelect: undefined;
  Detect: { categoryId: number;};
  Loading: { categoryId: number;};
};
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator 
        screenOptions={{
            headerShown: false,
            animation : 'fade',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ObjectSelect" component={ObjectSelectScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Detect" component={DetectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 