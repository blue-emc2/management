import React, { FC, SyntheticEvent, useContext, useRef, useState } from 'react';
import { Button, Icon, Segment, Message } from 'semantic-ui-react';
import EntryList from 'components/EntryList';
import { FirebaseContext } from 'contexts';

const EntryMain: FC = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState<Error | null>(null);
  const functionsRef = useRef(useContext(FirebaseContext));
  const { f } = functionsRef.current;
  if (!f) throw new Error('Functions is not initialized');

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();

    const users = f.httpsCallable('users');
    users()
      .then(result => {
        setUserList(result.data);
        setError(null);
      })
      .catch(err => {
        setError(err);
      });
  };

  return (
    <>
      <Segment floated="right" basic>
        <Button icon color="olive" onClick={handleClick}>
          <Icon name="refresh" />
        </Button>
      </Segment>
      <EntryList userList={userList} />
      {error !== null && (
        <Message color="red">
          <Message.Content>{error.stack}</Message.Content>
        </Message>
      )}
    </>
  );
};

export default EntryMain;
