import React, { FC, MouseEventHandler } from 'react';
import {
  Flex, Button, HTMLChakraProps,
} from '@chakra-ui/react';

type CategorySelectorProps = {
  list: Category[],
  selectId: string,
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const CategorySelector: FC<CategorySelectorProps> = (({ list, selectId, handleSelect }) => (
  <>
    <Flex direction="row" width="100%" justifyContent="flex-start">
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
        All
      </Button>
      {list?.map((category) => (
        <Button
          height="36px"
          padding="0 16px"
          background={selectId === category.id ? '#000000' : ''}
          borderRadius="2px"
          fontSize="16px"
          fontFamily="TTHoves-Medium, TTHoves"
          fontWeight="500"
          color={selectId === category.id ? '#FFFFFF' : '#999999'}
          key={category.id}
          id={category.id}
          m="0 40px 0 0"
          onClick={handleSelect}
          _hover={{ background: '#000000', color: '#FFFFFF' }}
          _focus={{
            border: 'none',
            textDecoration: 'none',
          }}
        >
          {category.name}
        </Button>
      ))}
    </Flex>
  </>
));

export default CategorySelector;
