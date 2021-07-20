// theme.js
import { extendTheme, ThemeOverride } from '@chakra-ui/react';

// Global style overrides
import styles from './styles';

import colors from './colors';
import Link from './components/link';
import Container from './components/container';
import Button from './components/button';
import Input from './components/input';

const overrides: ThemeOverride = {
  colors,
  // colorMode config
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles, // global style
  // Other foundational style overrides go here
  components: {
    Input,
    Link,
    Container,
    Button,
    // Other components go here
  },
};

export default extendTheme(overrides);
