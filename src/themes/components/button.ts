import { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  baseStyle: {
    outline: 'none',
    _hover: {
      textDecoration: 'none',
      outline: 'none',
    },
    _focus: {
      textDecoration: 'none',
      boxShadow: 'none',
    },
  },
};

export default Button;
