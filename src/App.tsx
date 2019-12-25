import React from 'react';
import { Segment, Container, Form } from 'semantic-ui-react';
import './App.css';
import EntryList from 'components/EntryList';

const App: React.FC = () => {
  return (
    <div className="App">
      <Container>
        <Segment>
          <Form>
            <Form.Group>
              <Form.Button basic size="big" floated="left">
                はじめる
              </Form.Button>
            </Form.Group>
            <Form.Group inline>
              <Form.TextArea
                width={12}
                placeholder="パンはパンでも食べられないパンはなーんだ"
              />
              <Form.Button basic size="big" width={2}>
                送信
              </Form.Button>
            </Form.Group>
          </Form>
        </Segment>
        <Segment>
          <EntryList />
        </Segment>
      </Container>
    </div>
  );
};

export default App;
