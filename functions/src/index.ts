import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

// enum State {
//   Standby = 0,
//   JoinWaiting,
//   JoinFinished,
//   QuestionDeliver,
//   AnswerWaiting,
//   AnswerFinished,
// }

admin.initializeApp();
const db = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const createQuestion = functions.https.onRequest(async (req, res) => {
  const { question } = req.body;
  const ref = db.collection('/questions');
  await ref
    .add({
      question,
    })
    .then(() => {
      res.status(200).send('OK!'); // TODO: 後でよしなにする
    });
});

export const updateState = functions.https.onRequest(async (req, res) => {
  const ref = db.collection('/management').doc('one');
  const { state } = req.body;

  ref.set({ state }, { merge: true }).then(() => {
    res.status(200).send(state);
  });
});
