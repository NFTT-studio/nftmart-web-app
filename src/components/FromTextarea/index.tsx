import React, { ChangeEventHandler, FC } from 'react';
import {
  Textarea,
} from '@chakra-ui/react';

interface Props {
  id: string
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

const FromTextarea: FC<Props> = ({ id, value, onChange }) => (
  <Textarea
    display="flex"
    alignItems="flex-start"
    width="600px"
    height="120px"
    background="#FFFFFF"
    borderRadius="4px"
    border="1px solid #E5E5E5"
    id={id}
    name={id}
    type="text"
    onChange={onChange}
    value={value}
  />
);

export default FromTextarea;
