import React, { FC } from 'react';
import firebase from 'firebase/app';
import 'firebase/functions';
import { FirebaseContext } from './contexts';

const FirebaseApp: FC = ({ children }) => {
  const f = firebase.functions();

  return (
    <FirebaseContext.Provider value={{ f }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
