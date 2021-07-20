import React, { FC } from 'react';
import {
  Button,
} from '@chakra-ui/react';

interface Props {
  text: string
}

const SubmitButton: FC<Props> = ({ text }) => (
  <Button
    mt="30px"
    w="96px"
    height="40px"
    background="#000000"
    borderRadius="4px"
    fontSize="14px"
    fontFamily="TTHoves-Medium, TTHoves"
    fontWeight="500"
    color="#FFFFFF"
    type="submit"
  >
    {text}
  </Button>
);

export default SubmitButton;
