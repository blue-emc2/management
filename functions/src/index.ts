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

// 最新のdocを1件返す
const getManagementLastDocQuery = () =>
  admin
    .firestore()
    .collection('/management')
    .orderBy('createdAt', 'desc')
    .limit(1);

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

// 保存先の初期化
export const initialize = functions.https.onRequest(async (req, res) => {
  const ref = admin
    .firestore()
    .collection('/management')
    .doc();

  await ref
    .set({ state: 0, createdAt: admin.firestore.Timestamp.now() })
    .then(() => {
      res.status(200).send(ref.toString());
    });
});

// 問題を作る
export const createQuestion = functions.https.onRequest(async (req, res) => {
  const { question } = req.body;
  const ref = getManagementLastDocQuery();
  const docs = await ref.get().then(snapshot => {
    return snapshot.docs;
  });

  docs[0].ref.set({ question }, { merge: true }).then(() => {
    res.status(200).send('OK!'); // TODO: 後でよしなにする
  });
});

export const updateState = functions.https.onRequest(async (req, res) => {
  const ref = admin
    .firestore()
    .collection('/management')
    .doc('one');
  const { state } = req.body;

  ref.set({ state }, { merge: true }).then(() => {
    res.status(200).send(state);
  });
});
