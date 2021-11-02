/* eslint-disable no-plusplus */
import React, { FC, MouseEventHandler } from 'react';
import {
  Image, HTMLChakraProps, Flex, Text, Button,
} from '@chakra-ui/react';

import {
  IconChecked,
  Polkadot,
} from '../../assets/images';
import {
  PINATA_SERVER,
} from '../../constants';

type CollectionSelectorProps = {
  collectionArr: Collection[],
  selectedArr: string[],
  handleSelect: MouseEventHandler<HTMLButtonElement>
} & HTMLChakraProps<'div'>

const CollectionSelector: FC<CollectionSelectorProps> = (({ selectedArr, collectionArr, handleSelect }) => (
  <Flex
    p="0 9px"
    boxSizing="border-box"
    w="100%"
    direction="column"
    h="485px"
    overflowY="scroll"
  >
    {collectionArr?.map((collection, index) => {
      const isselected = selectedArr.indexOf(collection.id) > -1;
      if (isselected) {
        collectionArr.unshift(collectionArr.splice(index, 1)[0]);
      }
      return (
        <Button
          key={collection.id}
          id={collection.id}
          onClick={handleSelect}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          background="none"
          h="30px"
          padding="0px 0 0 0"
          m="8px 0 8px 0 !important"
          outline="none"
          _hover={{ background: 'none' }}
          _focus={{
            border: 'none',
            textDecoration: 'none',
          }}
        >
          {isselected
            ? <Image w="30px" h="30px" mr="8px" src={IconChecked.default} alt="" />
            : (
              <Image
                w="30px"
                h="30px"
                mr="8px"
                borderRadius="50%"
                src={`${PINATA_SERVER}logo/${collection?.metadata?.logoUrl}?imageMogr2/thumbnail/50x50/interlace/0`}
                alt=""
              />
            )}
          <Text
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#191A24"
          >
            {collection?.metadata?.name}
          </Text>
        </Button>
      );
    })}
  </Flex>
));

export default CollectionSelector;
