import React, { useState } from 'react';
import {
  Flex,
  Container,
  Box,
  Text,
  Image,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Spinner,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { RouteComponentProps, useHistory, Link as RouterLink } from 'react-router-dom';
import MainContainer from '../../layout/MainContainer';
import PriceHistoryChart from './PriceHistoryChart';
import CancelDialog from './CancelDialog';

import {
  IconDetailsocllections,
  // IconDetailsRefresh,
  // IconDetailshaSre,
  // IconDetailsCollection,
  IconDetailsDetail,
  ImgWorksBg,
  HuoDong,
  DISCORD,
  WEBSITE,
  Facebook,
  TWITTER,
  // PriceIcon,
  Historyempty,
  HeadPortrait,
  IconAbout,
  IconPriceHistory,
  IconProperties,
  Iconprice,
  IconOffersDetail,
  // IconLeft,
} from '../../assets/images';
import useNft from '../../hooks/reactQuery/useNft';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import {
  PINATA_SERVER,
} from '../../constants';
import { priceStringDivUnit } from '../../utils/format';
import useIsLoginAddress from '../../hooks/utils/useIsLoginAddress';
import { SELLING } from '../../constants/Status';
import { useAppSelector } from '../../hooks/redux';
import BuyDialog from './BuyDialog';

const propertiesArr = [1, 2, 3, 4, 5, 6];
const ICONS = [
  { icon: HuoDong.default },
  { icon: DISCORD.default },
  { icon: TWITTER.default },
  { icon: Facebook.default },
  { icon: WEBSITE.default },
];
const ICON_LIST = ICONS.map((item, index) => ({
  src: item.icon,
  id: index,
  link: '',
}));
const OfferssArr = [1, 2, 3];
const OfferssUnitArr = [1, 2, 3, 4, 5, 6];

const Detail = ({ match }: RouteComponentProps<{ nftId: string }>) => {
  const chainState = useAppSelector((state) => state.chain);
  const { t } = useTranslation();
  const history = useHistory();

  const { account } = chainState;
  const { nftId } = match.params;
  const collectionsId = nftId.split('-')[0];

  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const [isShowCancel, setIsShowCancel] = useState(false);
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: nftData, isLoading: nftDataIsLoading } = useNft(nftId);
  const { data: collectionsData, isLoading: collectionsDateIsLoading } = useCollectionsSinger(collectionsId);

  const isLoginAddress = useIsLoginAddress(nftData?.nftInfo.owner_id);

  if (nftDataIsLoading || collectionsDateIsLoading || !nftData) {
    return <Spinner />;
  }

  const logoUrl = `${PINATA_SERVER}${nftData.nftInfo.metadata.logoUrl}`;
  const price = priceStringDivUnit(nftData?.nftInfo?.price);
  const collectionName = collectionsData?.collection?.metadata?.name;
  const nftName = nftData?.nftInfo?.metadata.name;

  const firstOffer = nftData?.nftInfo?.offers[0];
  const ownerId = nftData?.nftInfo?.owner_id;
  const orderId = firstOffer?.order_id;
  const hideFlag = false;
  const handleBuy = () => {
    if (!account) {
      history.push(`/connect?callbackUrl=item/${nftId}`);
    }
    setIsShowBuy(true);
  };

  const NoData = (width: string) => (
    <AccordionPanel p="0px">
      <Flex
        width={width}
        height="260px"
        background="#FFFFFF"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          w="150px"
          h="100px"
          borderStyle="dashed"
          src={Historyempty.default}
        />
        <Text
          mt="10px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#999999"
          lineHeight="20px"
        >
          No data yet
        </Text>
      </Flex>
    </AccordionPanel>
  );

  return (
    <MainContainer title={t('Detail.title')}>
      {isLoginAddress ? (
        <>
          {nftData?.nftInfo.status === SELLING
            ? (
              <Flex
                w="100vw"
                background="#F9F9F9"
                justifyContent="center"
                h="80px"
                alignItems="center"
              >
                <Flex
                  width="100%"
                  h="100%"
                  maxWidth="1364px"
                  justifyContent="flex-end"
                >
                  <Flex h="100%" alignItems="center">
                    <Button
                      ml="30px"
                      width="110px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      border="1px solid #000000"
                      _hover={{
                        background: '#000000',
                        color: '#FFFFFF',
                      }}
                      onClick={() => setIsShowCancel(true)}
                    >
                      {t('Detail.cancel')}
                    </Button>
                    {/* <Button
                      ml="10px"
                      width="110px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      border="1px solid #000000"
                      _hover={{
                        background: '#000000',
                        color: '#FFFFFF',
                      }}
                      onClick={() => history.push(`/sellSetting/${nftId}`)}
                    >
                      {t('Detail.Setting')}
                    </Button> */}
                  </Flex>
                </Flex>

              </Flex>

            )
            : (
              <Flex
                w="100vw"
                background="#F9F9F9"
                justifyContent="center"
                h="80px"
                alignItems="center"
              >
                <Flex
                  width="100%"
                  h="100%"
                  maxWidth="1364px"
                  justifyContent="flex-end"
                >
                  <Flex h="100%" alignItems="center">
                    <Button
                      ml="10px"
                      width="110px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                      border="1px solid #000000"
                      _hover={{
                        background: '#000000',
                        color: '#FFFFFF',
                      }}
                      onClick={() => history.push(`/sellSetting/${nftId}`)}
                    >
                      {t('Detail.Sell')}
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            )}
        </>
      ) : ''}

      <Container
        mt="40px"
        display="flex"
        flexDirection="column"
        width="100%"
        justifyContent="flex-start"
      >

        <Flex
          w="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            width="560px"
            height="420px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgImage={ImgWorksBg.default}
            backgroundSize="100% 100%"
          >
            <Box
              width="520px"
              height="380px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                objectFit="contain"
                width="auto"
                height="auto"
                border-radius="5px"
                maxWidth="100%"
                maxHeight="100%"
                src={logoUrl}
              />
            </Box>
          </Flex>
          <Flex
            width="788px"
            minHeight="420px"
            flexDirection="column"
            justifyContent="flex-start"
            borderBottom="1px solid #000000"
          >

            <Flex p="0 20px 0 20px" width="100%" h="40px" justifyContent="space-between" alignItems="flex-start">
              <Link
                as={RouterLink}
                to={`/collection/${account?.address}?collectionId=${collectionsData?.collection?.id}`}
              >
                <Flex h="18px" alignItems="flex-start">
                  <Text
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                  >
                    {collectionName}
                  </Text>
                  <Image
                    ml="4px"
                    w="18px"
                    h="18px"
                    src={IconDetailsocllections.default}
                  />
                </Flex>
              </Link>
              {/* <Flex>
                <Box
                  width="40px"
                  height="40px"
                  borderRadius="4px 0px 0px 4px"
                  border="1px solid #E5E5E5"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{
                    boxShadow: '0px 2px 8px 0px #E1E1E1',
                  }}
                >
                  <Image
                    w="22px"
                    h="22px"
                    src={IconDetailsRefresh.default}
                  />
                </Box>
                <Box
                  width="40px"
                  height="40px"
                  borderTop="1px solid #E5E5E5"
                  borderBottom="1px solid #E5E5E5"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{
                    boxShadow: '0px 2px 8px 0px #E1E1E1',
                  }}
                >
                  <Image
                    w="22px"
                    h="22px"
                    src={IconDetailshaSre.default}
                  />
                </Box>
                <Box
                  width="40px"
                  height="40px"
                  borderRadius="0px 4px 4px 0px"
                  border="1px solid #E5E5E5"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{
                    boxShadow: '0px 2px 8px 0px #E1E1E1',
                  }}
                >
                  <Image
                    w="22px"
                    h="22px"
                    src={IconDetailsCollection.default}
                  />
                </Box>

              </Flex> */}
            </Flex>
            <Flex p="0 20px 0 20px">
              <Text
                fontSize="40px"
                fontFamily="TTHoves-Bold, TTHoves"
                fontWeight="bold"
                color="#333333"
              >
                {nftName}
              </Text>
            </Flex>
            <Flex p="0 20px 0 20px" m="16px 0px 32px 0px" h="22px" justifyContent="flex-start" alignItems="center">
              <Flex alignItems="center" mr="30px">
                <Image
                  mr="8px"
                  w="22px"
                  h="22px"
                  src={HeadPortrait.default}
                />
                <Text
                  display="flex"
                  flexDirection="row"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                  lineHeight="16px"
                >
                  {t('Detail.ownedBy')}
                  <Link
                    href={`/account/${nftData?.nftInfo?.owner_id}/wallet`}
                    color="#3D00FF"
                  >
                    {nftData ? formatAddress(nftData?.nftInfo?.owner_id) : ''}
                  </Link>
                </Text>
              </Flex>
              {/* <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                mr="20px"
              >
                Listed Art
              </Text>
              <Flex h="22px" justifyContent="flex-start" alignItems="center" mr="20px">
                <Image
                  mr="4px"
                  w="16px"
                  h="16px"
                  src={IconDetailsCollection.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                >
                  12,993
                </Text>
              </Flex>
              <Flex h="22px" justifyContent="flex-start" alignItems="center">
                <Image
                  mr="4px"
                  w="16px"
                  h="16px"
                  src={IconDetailsCollection.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                >
                  56
                </Text>
              </Flex> */}
            </Flex>
            {/* <Flex
              w="100%"
              height="40px"
              background="#F14E1D"
              borderRadius="4px"
              alignItems="center"
              pl="20px"
            >
              <Flex alignItems="center" mr="30px">
                <Image
                  mr="8px"
                  w="16px"
                  h="16px"
                  src={IconDetailsCollection.default}
                />
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#FFFFFF"
                >
                  Sale ends in 4 days (2021-4-1 14:32:12)
                </Text>
              </Flex>
            </Flex> */}
            {/* <Flex
              w="100%"
              justifyContent="space-between"
              alignItems="flex-start"
              p="0 20px 0 20px"
            >
              <Flex flexDirection="column" justifyContent="flex-start">
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="16px"
                  m="45px 0 12px 0"
                >
                  Currnet price
                </Text>
                <Flex flexDirection="column" justifyContent="flex-start">
                  <Flex height="43px" flexDirection="row" alignItems="flex-end">
                    <Text
                      fontSize="36px"
                      fontFamily="TTHoves-Bold, TTHoves"
                      fontWeight="bold"
                      color="#333333"
                      lineHeight="43px"
                    >
                      123,66
                    </Text>
                    <Text
                      m="0 0 8px 4px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#999999"
                    >
                      NMT ($1,146.90)
                    </Text>
                    <Image
                      m="0 0 8px 10px"
                      w="20px"
                      h="20px"
                      src={IconDetailsCollection.default}
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex flexDirection="column" justifyContent="flex-start">
                <Button
                  width="184px"
                  height="48px"
                  background="#000000"
                  borderRadius="4px"
                  fontSize="16px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="500"
                  color="#FFFFFF"
                  m="43px 0px 10px 0"
                >
                  Currnet price
                </Button>

                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  * Extend 30 minutes after bidding
                </Text>
              </Flex>
            </Flex> */}
            <Flex
              width="788px"
              height="65px"
              background="#F9F9F9"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px 0 20px"
              m="20px 0 32px 0px"
            >
              <Text
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
              >
                {!isLoginAddress ? '*You can buy this item immediately using Fixed Price' : '-'}
              </Text>

              <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
                <Text
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="bold"
                  color="#999999"
                  display="flex"
                  flexDirection="row"
                >
                  {t('Detail.Fixedprice')}
                  <Text
                    m="0 3px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                  >
                    {price}
                  </Text>
                  NMT
                </Text>
                {!isLoginAddress
                  && (
                    <Button
                      ml="40px"
                      width="109px"
                      height="35px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #3D00FF"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#3D00FF"
                      onClick={handleBuy}
                    >
                      {t('Detail.BuyNow')}
                    </Button>
                  )}
              </Flex>

            </Flex>
          </Flex>
        </Flex>
        <Flex width="100%" justifyContent="space-around">
          <Flex className="DetailLeft" width="560px">
            <Accordion width="560px" defaultIndex={[0, 1, 2]} allowMultiple>
              <AccordionItem width="100%" border="none">
                <AccordionButton
                  height="62px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="0 20px"
                  borderBottom="1px solid #E5E5E5"
                  outline="none"
                  _focus={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Flex height="100%" alignItems="center">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={IconDetailsDetail.default}
                    />
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#000000"
                      lineHeight="18px"
                    >
                      {t('Detail.Detail')}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel p="16px 20px">
                  <Flex alignItems="center" mb="11px">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={HeadPortrait.default}
                    />
                    <Text
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#000000"
                      lineHeight="16px"
                    >
                      <Text
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="bold"
                        color="#000000"
                        display="flex"
                        flexDirection="row"
                      >
                        {t('Detail.createdBy')}
                        <Link
                          href={`/account/${nftData?.nftInfo?.creator_id}/wallet`}
                          m="0 3px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#3D00FF"
                        >
                          {nftData ? formatAddress(nftData?.nftInfo?.creator_id) : ''}
                        </Link>
                        {/* 2018-09-2 */}
                      </Text>
                    </Text>
                  </Flex>
                  <Text
                    fontSize="14px"
                    fontFamily="TTHoves-Light, TTHoves"
                    fontWeight="300"
                    color="#000000"
                    lineHeight="22px"
                  >
                    {nftData?.nftInfo?.metadata.description}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
              {/* <AccordionItem width="100%" border="none">
                <AccordionButton
                  height="62px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="0 20px"
                  borderBottom="1px solid #E5E5E5"
                  outline="none"
                  _focus={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Flex height="100%" alignItems="center">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={IconProperties.default}
                    />
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#000000"
                      lineHeight="18px"
                    >
                      {t('Detail.properties')}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                {hideFlag
                  ? (
                    <AccordionPanel
                      p="16px 20px 4px 20px"
                      display="flex"
                      flexFlow="row wrap"
                      justifyContent="space-between"
                    >
                      {propertiesArr.map((item) => (
                        <Flex
                          key={item}
                          mb="12px"
                          width="165px"
                          height="86px"
                          borderRadius="4px"
                          border="1px solid #000000"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >

                          <Text
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="14px"
                          >
                            HEAD
                          </Text>
                          <Text
                            m="8px 0"
                            fontSize="14px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="18px"
                          >
                            PANDA
                          </Text>
                          <Text
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            1.23% have this trait
                          </Text>
                        </Flex>
                      ))}

                    </AccordionPanel>
                  )
                  : (
                    <AccordionPanel p="0px">
                      <Flex
                        width="100%"
                        height="260px"
                        background="#FFFFFF"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Image
                          w="150px"
                          h="100px"
                          border="1px solid #999999"
                          borderStyle="dashed"
                          src={Historyempty.default}
                        />
                        <Text
                          mt="10px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          No trading data yet
                        </Text>
                      </Flex>
                    </AccordionPanel>
                  )}

              </AccordionItem> */}
              <AccordionItem width="100%" border="none">
                <AccordionButton
                  height="62px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="0 20px"
                  borderBottom="1px solid #E5E5E5"
                  outline="none"
                  _focus={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Flex height="100%" alignItems="center">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={IconAbout.default}
                    />
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#000000"
                      lineHeight="18px"
                    >
                      {t('Detail.about')}
                      {' '}
                      {collectionName}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                {hideFlag
                  ? (
                    <AccordionPanel p="16px 20px 16px 20px">
                      <Text
                        mb="16px"
                        fontSize="14px"
                        fontFamily="TTHoves-Light, TTHoves"
                        fontWeight="300"
                        color="#000000"
                        lineHeight="22px"
                      >
                        Here is an introduction to the portfolio.
                        If it is a cross-chain NFT asset, a contract is a portfolio.
                      </Text>

                      <Flex>
                        {ICON_LIST.map((item) => (
                          <Box
                            key="index"
                            width="40px"
                            height="40px"
                            borderRadius="4px 0px 0px 4px"
                            border="1px solid #E5E5E5"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            _hover={{
                              boxShadow: '0px 2px 8px 0px #E1E1E1',
                            }}
                          >
                            <Image
                              w="22px"
                              h="22px"
                              src={item.src}
                            />
                          </Box>
                        ))}
                      </Flex>

                    </AccordionPanel>
                  )
                  : (
                    <NoData width="100%" />
                  )}
              </AccordionItem>
            </Accordion>
          </Flex>

          <Flex className="DetailRight" width="788px">
            <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
              <AccordionItem width="100%" border="none">
                <AccordionButton
                  height="62px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="0 20px"
                  borderBottom="1px solid #E5E5E5"
                  outline="none"
                  _focus={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Flex height="100%" alignItems="center">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={IconPriceHistory.default}
                    />
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#000000"
                      lineHeight="18px"
                    >
                      {t('Detail.PriceHistory')}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                {hideFlag
                  ? (
                    <AccordionPanel p="20px">

                      <Flex flexDirection="row" justifyContent="flex-start" mb="20px">
                        <Flex m="0 20px" textAlign="center" flexDirection="column" justifyContent="center">
                          <Text
                            mb="2px"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            7天平均价格
                          </Text>
                          <Flex align="flex-start" alignItems="center">
                            <Box w="14px" h="14px" src={IconDetailsDetail.default} as="img" alt="" mr="4px" />
                            <Text
                              fontSize="16px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="18px"
                            >
                              198,234
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex textAlign="center" flexDirection="column" justifyContent="center">
                          <Text
                            mb="2px"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            7天平均价格
                          </Text>
                          <Flex align="flex-start" alignItems="center">
                            <Box w="14px" h="14px" src={IconDetailsDetail.default} as="img" alt="" mr="4px" />
                            <Text
                              fontSize="16px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="18px"
                            >
                              198,234
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <PriceHistoryChart />

                    </AccordionPanel>
                  )
                  : (
                    <NoData width="100%" />
                  )}
              </AccordionItem>
              <AccordionItem width="100%" border="none">
                <AccordionButton
                  height="62px"
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="0 20px"
                  borderBottom="1px solid #E5E5E5"
                  outline="none"
                  _focus={{
                    textDecoration: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <Flex height="100%" alignItems="center">
                    <Image
                      mr="8px"
                      w="22px"
                      h="22px"
                      src={Iconprice.default}
                    />
                    <Text
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color="#000000"
                      lineHeight="18px"
                    >
                      {t('Detail.Offers')}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                {hideFlag
                  ? (
                    <AccordionPanel p="0 20px">
                      <Flex w="100%" flexDirection="column" justifyContent="flex-start">
                        <Flex h="40px" w="100%" flexDirection="row" justifyContent="space-between" align="center">
                          <Text
                            w="136px"
                            textAlign="left"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="20px"
                          >
                            {t('Detail.From')}
                          </Text>
                          <Text
                            w="136px"
                            textAlign="center"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="20px"
                          >
                            {t('Detail.Price')}
                          </Text>
                          <Text
                            w="136px"
                            textAlign="center"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="20px"
                          >
                            {t('Detail.Expiration')}
                          </Text>
                          <Text
                            w="136px"
                            textAlign="right"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="20px"
                          />

                        </Flex>
                        {OfferssArr.map(() => (
                          <Flex
                            key="index"
                            h="54px"
                            w="100%"
                            flexDirection="row"
                            justifyContent="space-between"
                            align="center"
                          >
                            <Text
                              w="136px"
                              textAlign="left"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              3gte...7gsh
                            </Text>
                            <Text
                              w="136px"
                              display="flex"
                              flexDirection="row"
                              justifyContent="center"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              29084
                              <Text
                                ml="3px"
                                color="#999999"
                              >
                                NMT
                              </Text>
                            </Text>
                            <Text
                              w="136px"
                              textAlign="center"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="20px"
                            >
                              in 2 hours
                            </Text>
                            <Text
                              w="136px"
                              textAlign="right"
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#3D00FF"
                              lineHeight="20px"
                            >
                              Deal
                            </Text>
                          </Flex>
                        ))}
                        <Flex justifyContent="flex-end">
                          <Button
                            mt="16px"
                            width="132px"
                            height="40px"
                            background="#FFFFFF"
                            borderRadius="4px"
                            border="1px solid #000000"
                            fontSize="16px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="500"
                            color="#000000"
                          >
                            Make Offer
                          </Button>
                        </Flex>
                      </Flex>
                    </AccordionPanel>
                  )
                  : (
                    <NoData width="788px" />
                  )}

              </AccordionItem>
            </Accordion>
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end">
          <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
            <AccordionItem width="100%" border="none">
              <AccordionButton
                height="62px"
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p="0 20px"
                borderBottom="1px solid #E5E5E5"
                outline="none"
                _focus={{
                  textDecoration: 'none',
                  boxShadow: 'none',
                }}
              >
                <Flex height="100%" alignItems="center">
                  <Image
                    mr="8px"
                    w="22px"
                    h="22px"
                    src={IconOffersDetail.default}
                  />
                  <Text
                    fontSize="16px"
                    fontFamily="TTHoves-Medium, TTHoves"
                    fontWeight="500"
                    color="#000000"
                    lineHeight="18px"
                  >
                    {t('Detail.Offers')}
                  </Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
              {hideFlag
                ? (
                  <AccordionPanel p="0 20px">
                    <Flex w="100%" flexDirection="column" justifyContent="flex-start">
                      <Flex h="40px" w="100%" flexDirection="row" justifyContent="space-between" align="center">
                        <Text
                          w="136px"
                          textAlign="left"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.Event')}
                        </Text>
                        <Text
                          w="136px"
                          textAlign="center"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.UnitPrice')}
                        </Text>
                        <Text
                          w="136px"
                          textAlign="center"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.Quantity')}
                        </Text>
                        <Text
                          w="136px"
                          textAlign="center"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.From')}
                        </Text>
                        <Text
                          w="136px"
                          textAlign="center"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.To')}
                        </Text>
                        <Text
                          w="136px"
                          textAlign="right"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="20px"
                        >
                          {t('Detail.Date')}
                        </Text>

                      </Flex>
                      {OfferssUnitArr.map(() => (
                        <Flex
                          key="index"
                          h="54px"
                          w="100%"
                          flexDirection="row"
                          justifyContent="space-between"
                          align="center"
                        >
                          <Text
                            w="136px"
                            textAlign="left"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            Listing
                          </Text>
                          <Text
                            w="136px"
                            display="flex"
                            flexDirection="row"
                            justifyContent="center"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            29084
                            <Text
                              ml="3px"
                              color="#999999"
                            >
                              NMT
                            </Text>
                          </Text>
                          <Text
                            w="136px"
                            textAlign="center"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            6
                          </Text>
                          <Text
                            w="136px"
                            textAlign="center"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#3D00FF"
                            lineHeight="20px"
                          >
                            4tf...fp
                          </Text>
                          <Text
                            w="136px"
                            textAlign="center"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          />
                          <Text
                            w="136px"
                            textAlign="right"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="20px"
                          >
                            i minutes
                          </Text>
                        </Flex>
                      ))}

                    </Flex>
                  </AccordionPanel>
                )
                : (
                  <AccordionPanel p="0px">
                    <Flex
                      width="100%"
                      height="260px"
                      background="#FFFFFF"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image
                        w="150px"
                        h="100px"
                        src={Historyempty.default}
                      />
                      <Text
                        mt="10px"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#999999"
                        lineHeight="20px"
                      >
                        No offers data yet
                      </Text>
                    </Flex>
                  </AccordionPanel>
                )}

            </AccordionItem>
          </Accordion>
        </Flex>
        {isShowBuy && (
          <BuyDialog
            isShowBuy={isShowBuy}
            setIsShowBuy={setIsShowBuy}
            price={price}
            logoUrl={logoUrl}
            nftName={nftName}
            collectionName={collectionName}
            orderId={orderId}
            ownerId={ownerId}
          />
        )}
        {isShowCancel && (
          <CancelDialog
            isShowCancel={isShowCancel}
            setIsShowCancel={setIsShowCancel}
            orderId={orderId}
            nftId={nftId}
          />
        )}
      </Container>
      <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
        <ModalOverlay />
      </Modal>
    </MainContainer>

  );
};

export default Detail;
