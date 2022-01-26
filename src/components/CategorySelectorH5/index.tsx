/* eslint-disable no-unused-expressions */
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

type CategorySelectorProps = {
  list: Category[],
  selectId: string,
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const CategorySelector: FC<CategorySelectorProps> = ({ list, selectId, handleSelect }) => {
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
              src={All.default}
            />
            <Text fontSize="12px" pr="3px">
              {selectId
                ? t(`${list.find((s) => s.id === selectId)?.name}`)
                : t('ALL')}
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
        <>
          <Flex
            cursor="pointer"
            m="0 10px"
            boxSizing="border-box"
            h="40px"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#191A24"
            onClick={() => {
              handleSelect('');
              setOpening(false);
            }}
            borderBottom="1px solid #979797"
            lineHeight="0"
          >
            {selectId === ''
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
            {t('ALL')}
          </Flex>
          {list?.map((category) => (
            <Flex
              cursor="pointer"
              m="0 10px"
              boxSizing="border-box"
              h="40px"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              key={category.id}
              id={category.id}
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#191A24"
              onClick={() => {
                handleSelect(category.id);
                setOpening(false);
              }}
              borderBottom="1px solid #979797"
              lineHeight="0"
            >
              {selectId === category.id
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
              {t(category.name)}
            </Flex>
          ))}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
