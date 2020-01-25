import { firestore } from 'firebase-admin';

export type Props = {
  createdAt: firestore.Timestamp | null;
  users: {};
  question: string;
  count: number;
};
