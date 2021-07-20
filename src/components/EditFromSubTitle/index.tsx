import React, { FC } from 'react';
import {
  Text,
} from '@chakra-ui/react';

interface Props {
  text: string
}

const EditFromSubTitle: FC<Props> = ({ text }) => (
  <Text
    m="9px 0 24px 0"
    lineHeight="16px"
    fontSize="14px"
    fontFamily="TTHoves-Regular, TTHoves"
    fontWeight="400"
    color="#999999"
  >
    {text}
  </Text>
);

export default EditFromSubTitle;
