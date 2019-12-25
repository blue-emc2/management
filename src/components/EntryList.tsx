import React, { FC } from 'react';
import { Card, Button } from 'semantic-ui-react';

const entryList = [1, 2, 3, 4, 5, 6];

const EntryList: FC = () => {
  return (
    <Card.Group centered>
      {entryList.map(i => (
        <Card key={i}>
          <Card.Content>
            <Card.Header>{i}: 参加者名</Card.Header>
            <Card.Description>
              <strong>ここに回答を表示</strong>
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
