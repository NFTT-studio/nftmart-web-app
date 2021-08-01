import React, { useState } from 'react';
import {
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from '../../assets/images';

const Networks: Record<string, string> = {
  testnet: 'TestNet',
};

const Network = (): JSX.Element => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState('testnet');
  const [opening, setOpening] = useState(false);

  const handleSelectText = (key: string) => {
    setSelected(key);
    setOpening(false);
  };

  // Link render helper
  const renderButton = (key: string, idx: string | number | null | undefined) => {
    const path = Networks[key];

    return (
      <Button key={idx} variant="ghost" onClick={() => handleSelectText(key)}>
        {t(path)}
      </Button>
    );
  };

  return (
    <Popover
      placement="bottom"
      size="sm"
      variant="menu"
      isOpen={opening}
      onOpen={() => setOpening(true)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>
        <Stack direction="row" cursor="pointer" alignItems="center" spacing={0}>
          <Text fontSize="12px" pr="3px" color="#999999">{t(Networks[selected])}</Text>
          {opening ? (
            <Image
              width="12px"
              height="12px"
              src={IoMdArrowDropup.default}
            />
          ) : (
            <Image
              width="12px"
              height="12px"
              src={IoMdArrowDropdown.default}
            />
          )}
        </Stack>
      </PopoverTrigger>
      {/* TODO: Move focus property else where to have common use */}
      <PopoverContent maxWidth="100px" _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverBody display="flex" justifyContent="center">
          <Stack paddingY={2}>{Object.keys(Networks).map(renderButton)}</Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Network;
