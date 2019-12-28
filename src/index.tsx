import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase/app';
import FirebaseApp from 'FirebaseApp';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import firebaseConfig from './firebase-config';

const app = firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === 'development') {
  // ローカルのエミュレーターを動かすには.env.localではダメっぽい？
  app.functions().useFunctionsEmulator('http://localhost:5001');
}

ReactDOM.render(
  <FirebaseApp>
    <App />
  </FirebaseApp>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
