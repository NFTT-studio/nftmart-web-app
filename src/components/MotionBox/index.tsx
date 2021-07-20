import React from 'react';
import {
  forwardRef,
  ChakraProps,
  chakra,
  ComponentWithAs,
} from '@chakra-ui/react';
import { motion, MotionProps, isValidMotionProp } from 'framer-motion';

export type MotionBoxProps = Omit<ChakraProps, keyof MotionProps> &
  MotionProps & {
    as?: React.ElementType;
  };
const MotionBox = motion(
  forwardRef<MotionBoxProps, 'div'>((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key)),
    );
    // FIXME: ref type imcompatible
    return <chakra.div ref={ref as any} {...chakraProps} />;
  }),
) as ComponentWithAs<'div', MotionBoxProps>;

export default MotionBox;
