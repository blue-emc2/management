import React, { FC } from 'react';
import { Segment, Container } from 'semantic-ui-react';
import './App.css';
import QuestionForm from 'components/QuestionForm';
import EntryMain from 'components/EntryMain';

const App: FC = () => {
  return (
    <div className="App">
      <Container>
        <Segment>
          <QuestionForm />
        </Segment>
        <Segment>
          <EntryMain />
        </Segment>
      </Container>
    </div>
  );
};

export default App;
