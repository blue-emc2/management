import React, { FC } from 'react';
import { Form } from 'semantic-ui-react';

const QuestionForm: FC = () => {
  return (
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
  );
};

export default QuestionForm;
