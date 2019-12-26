import React from 'react';
import { Segment, Container } from 'semantic-ui-react';
import './App.css';
import EntryList from 'components/EntryList';
import QuestionForm from 'components/QuestionForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <Container>
        <Segment>
          <QuestionForm />
        </Segment>
        <Segment>
          <EntryList />
        </Segment>
      </Container>
    </div>
  );
};

export default App;
