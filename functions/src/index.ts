import * as functions from 'firebase-functions';
import admin, { firestore } from 'firebase-admin';

import { User } from './models/user';

// enum State {
//   Standby = 0,
//   JoinWaiting,
//   JoinFinished,
//   QuestionDeliver,
//   AnswerWaiting,
//   AnswerFinished,
// }

const app = admin.initializeApp();
const db = app.firestore();

// 最新のdocを1件返す
const getManagement = () => {
  return db.collection('/management');
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
    })
    .catch(() => {
      throw new functions.https.HttpsError('not-found', 'not found document');
    });

  return doc;
};

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

// 保存先の初期化
export const initialize = functions.https.onCall(async () => {
  const ref = db.collection('/management').doc();
  const result = await ref
    .set({ state: 0, createdAt: admin.firestore.Timestamp.now(), users: [] })
    .then(value => {
      return value; // TODO: エラー処理を後でよしなにする
    });

  return result;
});

// 問題を作る
export const createQuestion = functions.https.onCall(async data => {
  const question = data;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);
  const r = await doc.ref.update(question).then(value => {
    return value; // TODO: エラー処理を後でよしなにする
  });

  return r;
});

// 問題を取得する
export const question = functions.https.onCall(async () => {
  const ref = getManagement();
  const snapshot = await getFirstDoc(ref);
  let r = null;
  if (snapshot.exists) {
    r = snapshot.data().question as string;
  }

  if (!r) {
    throw new functions.https.HttpsError(
      'not-found',
      '問題文が作られるまでお待ち下さい',
    );
  }

  return r;
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
export const entry = functions.https.onCall(async data => {
  const { name } = data;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);

  // name重複チェック
  const users = doc.get('users');
  if (users.some((obj: User) => obj.name === name)) {
    throw new functions.https.HttpsError(
      'already-exists',
      'そのエントリー名は使えません',
    );
  }

  // TODO: 人数制限

  const r = await doc.ref.update({
    users: admin.firestore.FieldValue.arrayUnion({ name }),
  });

  return r;
});

// ユーザー取得
export const users = functions.https.onCall(async () => {
  const ref = getManagement();
  const snapshot = await getFirstDoc(ref);
  let r = null;
  if (snapshot.exists) {
    r = snapshot.data().users;
  }

  // TODO: ユーザーがいないときの対応

  return r;
});

// 回答登録
export const addAnswer = functions.https.onCall(async data => {
  const { name, answer } = data;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);
  const r = await doc.ref.update({
    users: admin.firestore.FieldValue.arrayUnion({ name, answer }),
  });

  return r;
});
