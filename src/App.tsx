import React, { FC, SyntheticEvent, useState, useRef, useContext } from 'react';
import { Segment, Container } from 'semantic-ui-react';
import './App.css';
import EntryList from 'components/EntryList';
import QuestionForm from 'components/QuestionForm';
import { FirebaseContext } from 'contexts';

const App: FC = () => {
  const [loading, setLoading] = useState(false);
  const functionsRef = useRef(useContext(FirebaseContext));
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();

    const { f } = functionsRef.current;
    if (!f) throw new Error('Functions is not initialized');
    const initialize = f.httpsCallable('initialize');

    setLoading(true);

    initialize()
      .then(result => {
        console.log(result.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <Container>
        <Segment>
          <QuestionForm handleClick={handleClick} loading={loading} />
        </Segment>
        <Segment>
          <EntryList />
        </Segment>
      </Container>
    </div>
  );
};

export default App;
