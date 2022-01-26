import React, { FC, MouseEventHandler, useState } from 'react';
import {
  Box, Button, HTMLChakraProps,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from '../../assets/images';
import {
  Sorts,
  All,
  Status,
  Select,
} from '../../assets/imagesH5';

type StatusSelectorProps = {
  statusArr: string[],
  selectedArr: string[],
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const StatusSelector: FC<StatusSelectorProps> = (({ selectedArr, statusArr, handleSelect }) => {
  const [opening, setOpening] = useState(false);
  const { t } = useTranslation();
  return (
    <Popover
      placement="bottom"
      size="sm"
      variant="menu"
      isOpen={opening}
      onOpen={() => setOpening(!opening)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>
        <Stack
          width="33.33%"
          height="40px"
          background={opening ? '#FFFFFF' : '#D8D8D8'}
          direction="row"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          p="0 7px"
          spacing={0}
        >
          <Flex
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              mr="3px"
              width="auto"
              height="16px"
              src={Status.default}
            />
            <Text fontSize="12px" pr="3px">
              {selectedArr?.length
                ? <Text fontSize="12px" pr="3px">{t(`Browsing.${selectedArr[0]}`)}</Text>
                : <Text fontSize="12px" pr="3px">Status</Text>}
            </Text>
          </Flex>
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
      <PopoverContent
        borderRadius="0"
        border="none"
        width="100vw"
        top="-8px"
        _focus={{ boxShadow: 'none' }}
      >
        {statusArr.map((status) => {
          const isselected = selectedArr?.indexOf(status) > -1;
          return (
            <Flex
              cursor="pointer"
              m="0 10px"
              boxSizing="border-box"
              h="40px"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              key={status}
              id={status}
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#191A24"
              onClick={handleSelect}
              borderBottom="1px solid #979797"
              lineHeight="0"
            >
              {isselected
                ? (
                  <Image
                    m="0 8px"
                    width="14px"
                    height="14px"
                    src={Select.default}
                  />
                ) : (
                  <Box
                    m="0 8px"
                    width="14px"
                    height="14px"
                  />
                )}
              {t(`Browsing.${status}`)}
            </Flex>
          );
        })}
      </PopoverContent>
    </Popover>
  );
});
export default StatusSelector;
