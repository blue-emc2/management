import * as functions from 'firebase-functions';
import admin, { firestore } from 'firebase-admin';

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
const getManagement = () => {
  return admin.firestore().collection('/management');
};

const getFirstDoc = (
  ref: firestore.CollectionReference,
): Promise<firestore.QueryDocumentSnapshot> => {
  const doc = ref
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then(snapshot => {
      return snapshot.docs[0];
    });

  return doc;
};

const app = admin.initializeApp();
const db = app.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

// 保存先の初期化
export const initialize = functions.https.onCall(async () => {
  const ref = db.collection('/management').doc();
  const result = await ref
    .set({ state: 0, createdAt: admin.firestore.Timestamp.now(), users: [] })
    .then(value => {
      return value; // res.status(200).send('OK'); // TODO: 後でよしなにする
    });

  return result;
});

// 問題を作る
export const createQuestion = functions.https.onRequest(async (req, res) => {
  const { question } = req.body;
  const ref = getManagement();
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
  const ref = getManagement();
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
  const ref = getManagement();
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
  const ref = getManagement();
  const snapshot = await getFirstDoc(ref);
  let r = null;
  if (snapshot.exists) {
    r = snapshot.data().users;
  } else {
    res.status(404);
  }

  res.status(200).send({ data: r });
});

// 回答登録
export const addAnswer = functions.https.onRequest(async (req, res) => {
  const { name, answer } = req.body;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);

  await doc.ref
    .update({
      users: admin.firestore.FieldValue.arrayUnion({ name, answer }),
    })
    .then(value => {
      res.status(200).send(value);
    });
});
