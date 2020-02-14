import React, { FC, SyntheticEvent, useContext, useRef, useState } from 'react';
import {
  Button,
  Icon,
  Segment,
  Message,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import EntryList from 'components/EntryList';
import { FirebaseContext } from 'contexts';

const EntryMain: FC = () => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState({});
  const [error, setError] = useState<Error | null>(null);
  const functionsRef = useRef(useContext(FirebaseContext));
  const { f } = functionsRef.current;
  if (!f) throw new Error('Functions is not initialized');

  const updateDocument = f.httpsCallable('updateDocument');

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const users = f.httpsCallable('users');
    users()
      .then(result => {
        setUserList(result.data);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFinishClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    updateDocument({ accepting: false })
      .then(() => {
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dimmer active={loading} inverted>
        <Loader content="Loading" />
      </Dimmer>

      <Segment floated="right" basic>
        <Button icon color="olive" onClick={handleClick}>
          <Icon name="refresh" />
        </Button>
        <Button icon color="red" onClick={handleFinishClick}>
          <Icon name="stop" />
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
