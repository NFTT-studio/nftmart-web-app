import React, { FC, useState } from 'react';
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
  Flex,
  Box,
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

import Sort from '../../constants/Sort';

type SortByProps = {
  selectedSort: string,
  setSelectedSort: React.Dispatch<React.SetStateAction<string>>
}

const SortBy: FC<SortByProps> = ({ selectedSort, setSelectedSort }) => {
  const [opening, setOpening] = useState(false);
  const { t } = useTranslation();

  const handleSelect = (key: string) => {
    setSelectedSort(key);
    setOpening(false);
  };

  const renderButton = (sort: { key: string, value: string }) => (
    <Flex
      cursor="pointer"
      m="0 10px"
      boxSizing="border-box"
      h="40px"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      key={sort.value}
      fontSize="14px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      color="#191A24"
      onClick={() => handleSelect(sort.key)}
      borderBottom="1px solid #979797"
      lineHeight="0"
    >
      {sort.key === selectedSort
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
      {t(`sortBy.${sort.value}`)}
    </Flex>
  );

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
              src={Sorts.default}
            />
            <Text fontSize="12px" pr="3px">{t(`sortBy.${Sort.find((s) => s.key === selectedSort)?.value}`)}</Text>
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
        {Sort.map(renderButton)}
      </PopoverContent>
    </Popover>
  );
};

export default SortBy;
