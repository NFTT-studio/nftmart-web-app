import React, { FC } from 'react';
import {
  Text,
} from '@chakra-ui/react';

interface Props {
  text: string
}

const EditFormTitle: FC<Props> = ({ text }) => (
  <Text
    mt="30px"
    lineHeight="23px"
    fontSize="20px"
    fontFamily="TTHoves-Medium, TTHoves"
    fontWeight="500"
  >
    {text}
  </Text>
);

export default EditFormTitle;
