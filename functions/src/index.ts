import * as functions from 'firebase-functions';
import admin, { firestore } from 'firebase-admin';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Props } from './props';

const initializeSet: Props = {
  createdAt: admin.firestore.Timestamp.now(),
  users: {},
  question: '',
  count: 0,
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

  const ref = getManagement().doc();
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
    r = snapshot.get('question');
  }

  if (!r) {
    throw new functions.https.HttpsError(
      'not-found',
      '問題文が作られるまでお待ち下さい',
    );
  }

  return r;
});

// ユーザー登録
export const entry = functions.https.onCall(async data => {
  const { name } = data;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);

  // name重複チェック
  const count = doc.get('count');
  if (count >= 6) {
    throw new HttpsError('already-exists', '募集は締め切りました');
  }

  const users = doc.get('users');
  if (Object.keys(users).some((obj: string) => obj === name)) {
    throw new functions.https.HttpsError(
      'already-exists',
      'そのエントリー名は使えません',
    );
  }

  await doc.ref.update({
    count: firestore.FieldValue.increment(1),
    [`users.${count}`]: { name },
  });

  // client側ではidとして扱う
  return count;
});

// ユーザー取得
export const users = functions.https.onCall(async () => {
  const ref = getManagement();
  const snapshot = await getFirstDoc(ref);
  let r = null;
  if (snapshot.exists) {
    r = snapshot.get('users');
  } else {
    throw new HttpsError('not-found', '参加者がいません');
  }

  return r;
});

// 回答登録
export const addAnswer = functions.https.onCall(async data => {
  const { name, answer, id } = data;
  const ref = getManagement();
  const doc = await getFirstDoc(ref);

  const r = await doc.ref.update({
    [`users.${id}`]: { name, answer },
  });

  return r;
});
