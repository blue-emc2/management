import React, { FC, SyntheticEvent } from 'react';
import { Form } from 'semantic-ui-react';

type Props = {
  handleClick?: (e: SyntheticEvent) => void;
  loading?: boolean;
};

const QuestionForm: FC<Props> = ({ handleClick, loading }) => {
  return (
    <Form loading={loading}>
      <Form.Group>
        <Form.Button basic size="big" floated="left" onClick={handleClick}>
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
