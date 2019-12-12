import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const createQuestion = functions.https.onRequest(async (req, res) => {
  const { question } = req.body;
  const db = admin.firestore();
  const ref = db.collection('/questions');
  await ref
    .add({
      question,
    })
    .then(() => {
      res.status(200).send('OK!'); // TODO: 後でよしなにする
    });
});
