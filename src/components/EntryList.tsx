import React, { FC, SyntheticEvent } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Users } from 'user';
import { times } from 'lodash';

interface CardProps {
  opend: boolean;
  id: number;
}

const cardList: CardProps[] = [];
times(6, (i: number) => {
  cardList.push({ id: i, opend: false });
});

const EntryList: FC<Users> = ({ userList }) => {
  const handleOpen = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <Card.Group centered>
      {cardList.map((props, i) => (
        <Card key={props.id}>
          <Card.Content>
            <Card.Header>
              参加者：{userList[i] ? userList[i].name : ''}
            </Card.Header>
          </Card.Content>
          <Card.Content extra>
            <Button basic onClick={handleOpen}>
              回答を開ける
            </Button>
            <Card.Description>
              <strong>
                {userList[i] ? userList[i].answer : ''}ここに回答を表示
              </strong>
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default EntryList;
