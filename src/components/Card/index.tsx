import React, { FC } from 'react';
import {
  Box, Heading, Divider, HTMLChakraProps,
} from '@chakra-ui/react';
import { Colors } from '../../constants';

export const CardHead: FC = ({ children }) => (
  <Box paddingX={4} display="inline-block">
    <Box paddingY={4}>
      <Heading as="h4" size="md" color={Colors.TextBlack}>
        {children}
      </Heading>
    </Box>
  </Box>
);

type CardBodyProps = {
  bodyPadding: boolean;
}

export const CardBody: FC<CardBodyProps> = ({ children, bodyPadding }) => (
  <Box paddingX={bodyPadding ? 4 : 0}>
    <Box paddingY={bodyPadding ? 4 : 0}>{children}</Box>
  </Box>
);

export type CardProps = {
  title?: React.ReactNode;
  icon?: string;
  body?: React.ReactNode;
  bodyPadding?: boolean;
  noHeadBorder?: boolean;
} & HTMLChakraProps<'div'>

const Card: FC<CardProps> = ({
  title,
  icon,
  noHeadBorder = false,
  body,
  bodyPadding = true,
  children,
  ...restProps
}) => (
  <Box borderRadius="3px" backgroundColor="white" padding={0} {...restProps}>
    {icon && (
    <Box as="img" src={icon} w="22px" h="22px" marginLeft="20px" display="inline-block" />
    )}
    {title && <CardHead>{title}</CardHead>}
    {title && !noHeadBorder && <Divider borderColor={Colors.DividerDark} />}
    {body || <CardBody bodyPadding={bodyPadding}>{children}</CardBody>}
  </Box>
);

export default Card;
