import React, { FC, useEffect, useState } from 'react';
import {
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import console from 'console';
import {
  IconAdd,
} from '../../../assets/images';
import useCategories from '../../../hooks/reactQuery/useCategories';

interface Props {
  categories:never[],
  onChange?: () => any;
  setCategories: React.Dispatch<React.SetStateAction<never[]>>,
}
const ChangeLanguage: FC<Props> = (({
  categories, setCategories, onChange,
}) => {
  useEffect(() => {
    if (categories) onChange();
  }, [categories]);
  const { i18n, t } = useTranslation();
  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();

  const [opening, setOpening] = useState(false);

  const handleSelectLang = (l) => {
    const num = categories.indexOf(l);
    const newcategories = categories.concat(l);
    if (num === -1) {
      setCategories(newcategories);
      setOpening(false);
    }
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
        <Flex
          cursor="pointer"
          display={categories.length === 2 ? 'none' : 'flex'}
          width="124px"
          height="40px"
          borderRadius="4px"
          border="1px solid #000000"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#000000"
          lineHeight="14px"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            mr="10px"
            w="14px"
            h="14px"
            src={IconAdd.default}
          />
          {t('common.category')}
        </Flex>
      </PopoverTrigger>
      {/* TODO: Move focus property else where to have common use */}
      <PopoverContent maxWidth="140px" _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverBody display="flex" flexDirection="column" alignItems="center">
          {categoriesData?.categories?.length ? categoriesData.categories.map((item) => (
            <Button
              isDisabled={categories.length === 2}
              backgroundColor="#FFFFFF"
              key={item.name}
              width="124px"
              height="40px"
              borderRadius="4px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="14px"
              justifyContent="center"
              alignItems="center"
              onClick={() => handleSelectLang(item)}
            >
              {t(item.name)}
            </Button>
          )) : null}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default ChangeLanguage;
