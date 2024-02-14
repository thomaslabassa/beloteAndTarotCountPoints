import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import TarotInitialization from './screens/TarotInitialization'
import BeloteInitialization from './screens/BeloteInitialization';
import TarotGame from './components/TarotGame';
import PointsTarot from './components/PointsTarot';

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


import tarot from './reducers/tarot';

const persistConfig = {
  key: 'compteurPoint',
  storage: AsyncStorage,
};

const reducers = combineReducers({ tarot });
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
const persistor = persistStore(store)

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="TarotInitialization" component={TarotInitialization} />
            <Stack.Screen name="BeloteInitialization" component={BeloteInitialization} />
            <Stack.Screen name="TarotGame" component={TarotGame} />
            <Stack.Screen name="PointsTarot" component={PointsTarot} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
