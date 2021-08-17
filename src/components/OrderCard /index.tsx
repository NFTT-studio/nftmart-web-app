import React, { FC } from 'react';
import {
  HTMLChakraProps,
  Box,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import { Shimmer } from 'react-shimmer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { IPFS_URL } from '../../constants';
import { priceStringDivUnit } from '../../utils/format';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { renderNmtNumberText } from '../Balance';

import {
  PriceIcon,
  IconTime,
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

  const price = renderNmtNumberText(nft.price);
  return (
    <Link
      as={RouterLink}
      to={`/item/${nft.nft.nft_id}`}
    >
      <MotionBox
        width="260px"
        height="310px"
        backgroundColor="#fff"
        borderRadius="4px"
        cursor="pointer"
        marginTop="5px"
        _hover={{ boxShadow: 'lg' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        display="flex"
        flexDirection="column"
      >

        {nft?.metadata && (
        <LazyLoadImage
          wrapperProps={{
            style: {
              width: '260px',
              height: '195px',
              display: 'flex',
              justifyContent: 'center',
            },
          }}
          style={{
            objectFit: 'cover',
            width: '100%',
            maxHeight: '100%',
            borderRadius: '4px 4px 0 0 ',
          }}
          src={IPFS_URL + nft?.metadata.logoUrl}
          effect="blur"
          fallback={<Shimmer height={195} width={260} />}
        />
        )}
        <Box borderRadius="0 0 4px 4px" h="115px" display="flex" flexDirection="column" backgroundColor="#000000">
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
            <Box userSelect="none">{nft?.class.name}</Box>
            {nft?.price && (
            <Box userSelect="none" flex="1" textAlign="right">
              {t('NftCard.componentCollectionPrice')}
            </Box>
            )}
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
                maxWidth="130px"
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
            {nft?.price && (
            <Box textAlign="right" display="flex" justifyContent="center">
              <Flex align="flex-start" alignItems="center">
                <Box w="14px" h="14px" src={PriceIcon.default} as="img" alt="" mr="4px" />
                <Box color="#FFFFFF">{price}</Box>
              </Flex>
            </Box>
            )}
          </Box>
          <Box
            mt="0px"
            display="flex"
            justifyContent="space-between"
            padding="0 16px 0px 16px"
            paddingBottom=""
            fontSize="12px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#FFFFFF"
            lineHeight="14px"
          >
            <Box pr={2} />
            {0 / 1 ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex align="flex-start" alignItems="center">
                  <Box w="16px" h="16px" src={IconTime.default} as="img" alt="" mr="4px" />
                  <Box color="#FFFFFF">3 days left</Box>
                </Flex>
              </Box>
            ) : null}
            {0 / 1 ? (
              <Box textAlign="right" display="flex" justifyContent="center">
                <Flex align="flex-start" alignItems="center">
                  <Box color="#999999" mr="6px">Last</Box>
                  <Box
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#FFFFFF"
                    lineHeight="16px"
                    mr="9px"
                  >
                    12,823
                  </Box>
                  <Box color="#999999">NMT</Box>
                </Flex>
              </Box>
            ) : null}
            {0 / 1 ? (
              <Box
                fontSize="12px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color="#000000"
                lineHeight="14px"
                textAlign="right"
                display="flex"
                justifyContent="center"
              >
                <Flex align="flex-start" alignItems="center">
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="1px"
                  >
                    2
                  </Box>
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mr="3px"
                  >
                    2
                  </Box>

                  <Box
                    fontSize="12px"
                    color="#FFFFFF"
                  >
                    :
                  </Box>
                  <Box
                    mr="1px"
                    ml="3px"
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    2
                  </Box>
                  <Box
                    width="18px"
                    height="22px"
                    background="#FFFFFF"
                    borderRadius="1px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    2
                  </Box>
                </Flex>
              </Box>
            ) : null}
          </Box>

        </Box>
      </MotionBox>
    </Link>

  );
};

export default NftCard;
