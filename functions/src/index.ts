import * as functions from 'firebase-functions';
import admin, { firestore } from 'firebase-admin';

import { HttpsError } from 'firebase-functions/lib/providers/https';
import { User } from './models/user';

// enum State {
//   Standby = 0,
//   JoinWaiting,
//   JoinFinished,
//   QuestionDeliver,
//   AnswerWaiting,
//   AnswerFinished,
// }

const initializeSet = {
  state: 0,
  createdAt: admin.firestore.Timestamp.now(),
  users: [],
  question: '',
};
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

// 問題を作る
export const createQuestion = functions.https.onCall(async data => {
  initializeSet.question = data.question;

  const ref = db.collection('/management').doc();
  const result = await ref
    .set(initializeSet)
    .then(() => {
      console.info('initialize ok');
    })
    .catch((err: Error) => {
      throw new HttpsError('aborted', '初期化ができませんでした', err.message);
    });

  return result;
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

  if (users.length > 6) {
    throw new HttpsError('already-exists', '募集は締め切りました');
  }

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
  // めちゃくちゃダサいけど配列内の要素のupdateの方法がわからないので仕方ない...
  await doc.ref
    .update({
      users: admin.firestore.FieldValue.arrayRemove({ name }),
    })
    .then(() => {
      console.info('remove success');
    });

  const r = await doc.ref.update({
    users: admin.firestore.FieldValue.arrayUnion({ name, answer }),
  });

  return r;
});
