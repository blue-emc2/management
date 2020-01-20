import React, { FC, SyntheticEvent, useState, useContext, useRef } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { FirebaseContext } from 'contexts';

const QuestionForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const functionsRef = useRef(useContext(FirebaseContext));
  const { f } = functionsRef.current;
  if (!f) throw new Error('Functions is not initialized');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const createQuestion = f.httpsCallable('createQuestion');
    createQuestion({ question: text })
      .then(result => {
        console.log(result.data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form loading={loading} onSubmit={handleSubmit}>
      <Form.Group inline>
        <Form.TextArea
          width={12}
          placeholder="パンはパンでも食べられないパンはなーんだ"
          onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
            setText(event.currentTarget.value)
          }
        />
        <Button type="submit" basic size="big" width={2}>
          送信
        </Button>
      </Form.Group>
      {error !== null && (
        <Message color="red">
          <Message.Content>{error.stack}</Message.Content>
        </Message>
      )}
    </Form>
  );
};

export default QuestionForm;
