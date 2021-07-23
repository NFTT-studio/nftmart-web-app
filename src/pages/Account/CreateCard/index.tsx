import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Flex,
  Image,
  Text,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ImgAdd } from '../../../assets/images';

interface Props {
  collectionId?: string
}
const CreateCard: FC<Props> = (({ collectionId }) => {
  const { t } = useTranslation();

  return (
    <Link
      as={RouterLink}
      to={collectionId ? `/profile/nft/create/${collectionId}` : '/profile/collection/create'}
    >
      <Flex
        width="260px"
        height="316px"
        borderRadius="4px"
        border="1px solid #000000"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          border="1px solid #000000"
          borderStyle="dashed"
          w="100px"
          h="100px"
          src={ImgAdd.default}
          alt=""
        />
        <Text
          textAlign="center"
          w="100%"
          lineHeight="px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#999999"
        >
          {collectionId ? t('Create.nft') : t('Create.collection')}
        </Text>
        <Button
          mt="24px"
          width="109px"
          height="40px"
          background="#000000"
          borderRadius="4px"
        >
          <Text
            fontSize="14px"
            fontFamily="TTHoves-Medium, TTHoves"
            fontWeight="500"
            lineHeight="16px"
            color="#FFFFFF"
          >
            {t('Create.create')}
          </Text>
        </Button>

      </Flex>
    </Link>
  );
});
export default CreateCard;
