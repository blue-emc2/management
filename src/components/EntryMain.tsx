import React, { FC } from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import EntryList from 'components/EntryList';

const EntryMain: FC = () => {
  return (
    <>
      <Segment floated="right" basic>
        <Button icon color="olive">
          <Icon name="refresh" />
        </Button>
      </Segment>
      <EntryList />
    </>
  );
};

export default EntryMain;
