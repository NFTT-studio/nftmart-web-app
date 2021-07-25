import React, { FC } from 'react';
import {
  HTMLChakraProps,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { Shimmer } from 'react-shimmer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IPFS_URL } from '../../constants';
import { priceStringDivUnit } from '../../utils/format';

import {
  PriceIcon,
} from '../../assets/images';
import MotionBox from '../MotionBox';

type NftCardProps = {
  nft: Order
} & HTMLChakraProps<'div'>

const NftCard: FC<NftCardProps> = ({
  nft,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const price = priceStringDivUnit(nft?.price);
  return (
    <MotionBox
      width="260px"
      height="310px"
      backgroundColor="#fff"
      borderRadius="4px"
      cursor="pointer"
      _hover={{ boxShadow: 'lg' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      display="flex"
      flexDirection="column"
      onClick={() => history.push(`/item/${nft.id}`)}
    >
      {nft?.metadata && (
        <LazyLoadImage
          wrapperProps={{
            style: {
              width: '260px',
              height: '195px',
              borderBottom: '1px solid #000000',
              display: 'flex',
              justifyContent: 'center',
            },
          }}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '5px',
          }}
          src={IPFS_URL + nft?.metadata.logoUrl}
          effect="none"
          fallback={<Shimmer height={195} width={260} />}
          fadeIn
        />
      )}
      <Box h="115px" display="flex" flexDirection="column" backgroundColor="#000000">
        <Box
          mt="16px"
          display="flex"
          justifyContent="space-between"
          p="0 16px"
          height="17px"
          lineHeight="17px"
          fontSize="12px"
          color="#FFFFFF"
        >
          <Box userSelect="none">{t('NftCard.componentCollectionTitle')}</Box>
          {Number(nft.price) ? (
            <Box userSelect="none" flex="1" textAlign="right">
              {t('NftCard.componentCollectionPrice')}
            </Box>
          ) : null}
        </Box>
        <Box
          mt="8px"
          display="flex"
          justifyContent="space-between"
          padding="0 16px 16px 16px"
          paddingBottom=""
          fontWeight="600"
          color="#000000"
        >
          <Box pr={2}>
            {nft?.metadata && (
              <Text
                width="130px"
                color="#FFFFFF"
                align="center"
                fontSize="16px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="start"
              >
                {nft?.metadata.name}
              </Text>
            )}
          </Box>
          {Number(nft.price) ? (
            <Box textAlign="right" display="flex" justifyContent="center">
              <Flex align="flex-start" alignItems="center">
                <Box w="14px" h="14px" src={PriceIcon.default} as="img" alt="" mr="4px" />
                <Box color="#FFFFFF">{price}</Box>
              </Flex>
            </Box>
          ) : null}
        </Box>
      </Box>
    </MotionBox>

  );
};

export default NftCard;
