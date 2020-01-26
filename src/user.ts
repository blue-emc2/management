export interface User {
  name?: string;
  answer?: string;
}

export interface Users {
  userList: { [key: string]: User };
}
