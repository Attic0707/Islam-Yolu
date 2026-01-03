import React from "react";
import { registerRootComponent } from 'expo';
import Islam_Yolu from './Islam_Yolu';
import {TextSizeProvider} from './files/TextSizeContext';
import { SafeAreaProvider } from "react-native-safe-area-context";

function Root() {
  return (
    <SafeAreaProvider>
      <TextSizeProvider>
        <Islam_Yolu />
      </TextSizeProvider>
    </SafeAreaProvider>
  );
}
registerRootComponent(Root);