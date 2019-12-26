import { createContext } from 'react';

type FirebaseContextValue = {
  f: firebase.functions.Functions | null;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  f: null,
});
