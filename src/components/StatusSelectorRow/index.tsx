import React, { FC, MouseEventHandler } from 'react';
import {
  Box, Button, HTMLChakraProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type StatusSelectorRowProps = {
  statusArr: string[],
  selectedArr: string[],
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const StatusSelectorRow: FC<StatusSelectorRowProps> = (({ selectedArr, statusArr, handleSelect }) => {
  const { t } = useTranslation();
  return (
    <Box ml="20px" display="flex" flexFlow="row" justifyContent="space-between">
      {statusArr.map((status) => {
        const isselected = selectedArr.indexOf(status) > -1;
        return (
          <Button
            mr="20px"
            width="105px"
            height="36px"
            background={isselected ? '#000000' : '#FFFFFF'}
            borderRadius="20px"
            key={status}
            id={status}
            onClick={handleSelect}
            fontSize="12px"
            fontFamily="PingFangTC-Regular, PingFangTC"
            fontWeight="400"
            color={isselected ? '#FFFFFF' : '#000000'}
            border="1px solid #999999"
            _focus={{
              border: '1px solid #000000',
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
export default StatusSelectorRow;
