import React from "react";
import { registerRootComponent } from 'expo';
import Islam_Yolu from './Islam_Yolu';
import {TextSizeProvider} from './files/TextSizeContext';

function Root() {
  return (
    <TextSizeProvider>
      <Islam_Yolu />
    </TextSizeProvider>
  );
}
registerRootComponent(Root);