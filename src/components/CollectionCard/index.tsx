import React, { FC } from 'react';
import {
  HTMLChakraProps,
  Box,
} from '@chakra-ui/react';
import MotionBox from '../MotionBox';

type CollectionCardProps = {
  collection: Collection
} & HTMLChakraProps<'div'>

const CollectionCard: FC<CollectionCardProps> = ({
  collection: {
    name,
  },
}) => (
  <MotionBox
    width="260px"
    height="310px"
    backgroundColor="#fff"
    borderRadius="4px"
    cursor="pointer"
    _hover={{ boxShadow: 'lg' }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    display="flex"
    flexDirection="column"
  >
    <Box h="115px" display="flex" flexDirection="column" backgroundColor="#000000">
      {name}
    </Box>
  </MotionBox>
);

export default CollectionCard;
