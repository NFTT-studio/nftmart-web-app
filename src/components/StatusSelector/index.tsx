import React, { FC, MouseEventHandler } from 'react';
import {
  Box, Button, HTMLChakraProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type StatusSelectorProps = {
  statusArr: string[],
  selectedArr: string[],
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const StatusSelector: FC<StatusSelectorProps> = (({ selectedArr, statusArr, handleSelect }) => {
  const { t } = useTranslation();
  return (
    <Box w="220px" display="flex" flexFlow="row wrap" justifyContent="space-between">
      {statusArr.map((status) => {
        const isSelected = selectedArr.indexOf(status) > -1;
        return (
          <Button
            mt="10px"
            width="105px"
            height="40px"
            background={isSelected ? '#000000' : '#FFFFFF'}
            borderRadius="4px"
            key={status}
            id={status}
            onClick={handleSelect}
            fontSize="14px"
            fontFamily="PingFangTC-Regular, PingFangTC"
            fontWeight="400"
            color={isSelected ? '#FFFFFF' : '#000000'}
            _focus={{
              border: 'none',
              textDecoration: 'none',
            }}
          >
            {t(`Browsing.${status}`)}
          </Button>
        );
      })}
    </Box>
  );
});
export default StatusSelector;
