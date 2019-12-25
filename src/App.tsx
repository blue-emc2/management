import React from 'react';
import { Card, Button, Segment, Container, Form } from 'semantic-ui-react';
import './App.css';

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
          <Card>
            <Card.Content>
              <Card.Header>参加者名</Card.Header>
              <Card.Description>
                <strong>ここに回答を表示</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button basic>回答を開ける</Button>
            </Card.Content>
          </Card>
        </Segment>
      </Container>
    </div>
  );
};

export default App;
