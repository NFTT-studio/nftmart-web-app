import React, { FC } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import Image, { Shimmer } from 'react-shimmer';
import { Colors } from '../../constants';
import {
  Emptyimg,
} from '../../assets/images';

export interface EmptyProps {
  image?: React.ReactNode;
  description?: string;
}

// const DefaultImage = <Box height={233} width={188} backgroundColor={Colors.divider.dark} ></Box>;

const Empty: FC<EmptyProps> = ({ image = Emptyimg, description }) => {
  const imageNode = typeof image === 'string' ? (
    <Image src={image} fallback={<Shimmer width={300} height={400} />} />
  ) : (
    image
  );

  return (
    <Box textAlign="center">
      <Center marginBottom={3}>{imageNode}</Center>
      <Text color={Colors.Gray}>{description}</Text>
    </Box>
  );
};

export default Empty;
