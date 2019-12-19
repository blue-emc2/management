import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

// import { User } from './models/user';

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
    .set({ state: 0, createdAt: admin.firestore.Timestamp.now(), users: [] })
    .then(() => {
      res.status(200).send('OK'); // TODO: 後でよしなにする
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

// 状態更新
export const updateState = functions.https.onRequest(async (req, res) => {
  const { state } = req.body;
  const ref = getManagementLastDocQuery();
  const docs = await ref.get().then(snapshot => {
    return snapshot.docs;
  });

  docs[0].ref.set({ state }, { merge: true }).then(() => {
    res.status(200).send(`OK:${state}`); // TODO: 後でよしなにする
  });
});

// ユーザー登録
export const entry = functions.https.onRequest(async (req, res) => {
  const { name } = req.body;
  const ref = getManagementLastDocQuery();
  const docs = await ref.get().then(snapshot => {
    return snapshot.docs;
  });

  // TODO: 人数制限
  // TODO: name重複チェック

  docs[0].ref
    .update({
      users: admin.firestore.FieldValue.arrayUnion({ name }),
    })
    .then(() => {
      res.status(200).send(`OK:${name}`); // TODO: 後でよしなにする
    });
});

// ユーザー取得
export const users = functions.https.onRequest(async (req, res) => {
  const ref = getManagementLastDocQuery();
  const snapshot = await ref.get();

  const data = snapshot.docs.map(doc => {
    if (doc.exists) {
      return doc.data().users;
    }

    return null;
  });

  if (data) {
    res.status(200).send({ data });
  } else {
    res.status(404);
  }
});
