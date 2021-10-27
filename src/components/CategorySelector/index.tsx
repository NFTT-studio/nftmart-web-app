import React, { FC, MouseEventHandler } from 'react';
import {
  Flex, Button, HTMLChakraProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type CategorySelectorProps = {
  list: Category[],
  selectId: string,
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const CategorySelector: FC<CategorySelectorProps> = ({ list, selectId, handleSelect }) => {
  const { t } = useTranslation();
  return (
    <>
      <Flex flexFlow="row wrap" width="100%" justifyContent="flex-start">
        <Button
          height="36px"
          padding="0 16px"
          background={selectId === '' ? '#000000' : ''}
          borderRadius="2px"
          fontSize="16px"
          fontFamily="TTHoves-Medium, TTHoves"
          fontWeight="500"
          color={selectId === '' ? '#FFFFFF' : '#999999'}
          m="0 24px 0 0"
          onClick={handleSelect}
          _hover={{ background: '#000000', color: '#FFFFFF' }}
          _focus={{
            border: 'none',
            textDecoration: 'none',
          }}
        >
          {t('ALL')}
        </Button>
        {list?.map((category) => (
          <Button
            key={category.id}
            height="36px"
            padding="0 16px"
            background={selectId === category.id ? '#000000' : ''}
            borderRadius="2px"
            fontSize="16px"
            fontFamily="TTHoves-Medium, TTHoves"
            fontWeight="500"
            color={selectId === category.id ? '#FFFFFF' : '#999999'}
            id={category.id}
            m="0 2vw 0 0"
            onClick={handleSelect}
            _hover={{ background: '#000000', color: '#FFFFFF' }}
            _focus={{
              border: 'none',
              textDecoration: 'none',
            }}
          >
            {t(category.name)}
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default CategorySelector;
