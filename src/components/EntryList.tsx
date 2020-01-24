import React, { FC, SyntheticEvent, useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Users, User } from 'user';
import { times } from 'lodash';

interface CardProps {
  opend: boolean;
  id: number;
}

const list: CardProps[] = [];
times(6, (i: number) => {
  list.push({ id: i, opend: false });
});

const EntryList: FC<Users> = ({ userList }) => {
  const [cardList, setCardList] = useState(list);
  const handleOpen = (e: SyntheticEvent, user: User, card: CardProps) => {
    e.preventDefault();
    if (user === undefined) return;

    if (user.answer !== undefined) {
      cardList[card.id].opend = true;
      // cardListを分割して入れ直す必要がある（値の変更を検知できないため）
      setCardList([...cardList]);
    }
  };

  const anserOpenButton = (card: CardProps, user: User) => {
    return (
      <Button basic onClick={e => handleOpen(e, user, card)} key={card.id}>
        回答を開ける
      </Button>
    );
  };

  const answer = (user: User) => {
    return (
      <Card.Description>
        <strong>{user.answer ? user.answer : ''}</strong>
      </Card.Description>
    );
  };

  return (
    <Card.Group centered>
      {cardList.map((props, i) => (
        <Card key={`card_${props.id}`}>
          <Card.Content>
            <Card.Header>
              参加者：{userList[i] ? userList[i].name : ''}
            </Card.Header>
          </Card.Content>
          <Card.Content extra>
            {props.opend ? answer(userList[i]) : null}
            {!props.opend ? anserOpenButton(props, userList[i]) : null}
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default EntryList;
