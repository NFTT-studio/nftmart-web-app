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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from '../../assets/images';
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
    <Button
      display="flex"
      justifyContent="flex-start"
      key={sort.value}
      variant="ghost"
      fontSize="14px"
      fontFamily="TTHoves-Regular, TTHoves"
      fontWeight="400"
      color="#191A24"
      onClick={() => handleSelect(sort.key)}
    >
      {t(`sortBy.${sort.value}`)}
    </Button>
  );

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
        <Stack
          width="180px"
          height="36px"
          background="#FFFFFF"
          borderRadius="20px"
          border="1px solid #999999"
          direction="row"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          p="0 20px"
          spacing={0}
        >
          <Text fontSize="12px" pr="3px">{t(`sortBy.${Sort.find((s) => s.key === selectedSort)?.value}`)}</Text>
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
      <PopoverContent width="180px" _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverBody display="flex" justifyContent="center">
          <Stack
            paddingY={2}
          >
            {Sort.map(renderButton)}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SortBy;
