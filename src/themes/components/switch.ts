import { ComponentStyleConfig } from '@chakra-ui/react';

const Switch: ComponentStyleConfig = {
  baseStyle: {
    width: '40px',
    height: '20px',
    background: '#000000',
    borderRadius: '10px',
    _hover: {
      textDecoration: 'none',
      outline: 'none',
    },
    _focus: {
      textDecoration: 'none',
      boxShadow: '#000000',
      background: 'none',
    },
  },
};

export default Switch;
