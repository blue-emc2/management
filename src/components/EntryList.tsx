import React, { FC } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Users } from 'user';

const entryList = [1, 2, 3, 4, 5, 6];

const EntryList: FC<Users> = ({ userList }) => {
  return (
    <Card.Group centered>
      {entryList.map(i => (
        <Card key={i}>
          <Card.Content>
            <Card.Header>{userList[i].name}: 参加者名</Card.Header>
            <Card.Description>
              <strong>{userList[i].answer}ここに回答を表示</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button basic>回答を開ける</Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default EntryList;
