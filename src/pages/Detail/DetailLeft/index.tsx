/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import React, { FC } from 'react';
import {
  Flex,
  Image,
  Text,
  AccordionPanel,
  AccordionItem,
  Accordion,
  Box,
  AccordionIcon,
  AccordionButton,
  Link,
  AspectRatio,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import NoData from '../NoData';

import {
  ImgFillTop,
  ImgFillBottom,
  IconDetailsDetail,
  HeadPortrait,
  IconAbout,
  WEBSITE,
  DISCORD,
  TWITTER,
  IconIns,
  medium,
  telegram,
  IconProperties,
  Historyempty,
} from '../../../assets/images';
import {
  PINATA_SERVER,
} from '../../../constants';

interface Props {
  nftData: {
    nftInfo: {
      burned: string | null
      class_id: string
      creator_id: string
      deposit: string | null
      id: string
      metadata: Metadata
      description: string
      logoUrl: string
      name: string
      nftMartUrl: string
      url: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offers: any[]
      order_status: string
      owner_id: string
      price: string
      quantity: number
      royalty: boolean
      status: Status
      token_id: string
      category: []
    }
  },
  collectionsData:{
    collection:{
      metadata:{
        name: string,
        id: string,
        description: string,
        logoUrl: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        links: {} | undefined,
      },
      royalty_rate: number,
      id: string
    }
  } | undefined,
  logoUrl:string,
  propertiesArr:[],
}
const DetailLeft: FC<Props> = (({
  nftData,
  collectionsData,
  logoUrl,
  propertiesArr,
}) => {
  const ICONS = [
    { icon: WEBSITE.default, name: 'website' },
    { icon: DISCORD.default, name: 'discord' },
    { icon: TWITTER.default, name: 'twitter' },
    { icon: IconIns.default, name: 'ins' },
    { icon: medium.default, name: 'medium' },
    { icon: telegram.default, name: 'telegram' },
  ];
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  const collectionName = collectionsData?.collection?.metadata?.name;
  const collectionDescription = collectionsData?.collection?.metadata?.description;
  const links = collectionsData?.collection?.metadata?.links;
  const ICON_LIST = ICONS.map((item, index) => ({
    src: item.icon,
    id: index,
    link: links ? links[item.name] : '',
  }));
  const { t } = useTranslation();
  return (
    <Flex width="560px" flexDirection="column">
      <Flex
        width="560px"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="relative"
        >
          <Image
            width="40px"
            height="40px"
            src={ImgFillTop.default}
            position="absolute"
            right="0px"
          />
          {nftData?.nftInfo?.metadata?.fileType === 'mp4' || nftData?.nftInfo?.metadata?.fileType === 'mp3'
            ? (
              <AspectRatio
                m="20px"
                width="520px"
              >
                <iframe
                  title="naruto"
                  src={`${PINATA_SERVER + nftData?.nftInfo?.metadata.logoUrl}?rel=0&amp;autoplay=1`}
                  allowFullScreen
                  frameBorder="0"
                />
              </AspectRatio>
            )
            : (
              <Image
                m="20px"
                maxWidth="520px"
                height="auto"
                src={logoUrl}
              />
            )}
          <Image
            position="absolute"
            left="0px"
            bottom="0px"
            width="40px"
            height="40px"
            src={ImgFillBottom.default}
          />
        </Box>
      </Flex>
      <Flex width="560px">
        <Accordion width="560px" defaultIndex={[0, 2]} allowMultiple>
          <AccordionItem mt="36px" width="100%" border="none">
            <AccordionButton
              height="62px"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px"
              border="1px solid #E5E5E5"
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
                  {t('Detail.detail')}
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
                    fontWeight="400"
                    color="#000000"
                    display="flex"
                    flexDirection="row"
                  >
                    {t('Detail.createdBy')}
                    <Link
                      as={RouterLink}
                      to={`/account/${nftData?.nftInfo?.creator_id}/wallet`}
                      m="0 3px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#3D00FF"
                      onClick={() => {
                        localStorage.setItem('ButtonSelect', '1');
                      }}
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
          <AccordionItem mt="20px" width="100%" border="none">
            <AccordionButton
              height="62px"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px"
              border="1px solid #E5E5E5"
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
            {0 / 1
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

          </AccordionItem>
          <AccordionItem mt="20px" width="100%" border="none">
            <AccordionButton
              height="62px"
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="0 20px"
              border="1px solid #E5E5E5"
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
            {collectionDescription
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
                    {collectionDescription}
                  </Text>

                  <Flex>
                    {ICON_LIST.map((item, index) => (
                      item.link === '' ? null
                        : (
                          <Link
                            href={item.link}
                          >
                            <Box
                              key="index"
                              width="40px"
                              height="40px"
                              borderRadius={index === 0 ? '4px 0px 0px 4px' : index === ICON_LIST.length - 1 ? '0px 4px 4px 0px' : ''}
                              borderTop="1px solid #E5E5E5"
                              borderBottom="1px solid #E5E5E5"
                              borderLeft="1px solid #E5E5E5"
                              borderRight={index === ICON_LIST.length - 1 ? '1px solid #E5E5E5' : ''}
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

                          </Link>
                        )
                    ))}
                  </Flex>

                </AccordionPanel>
              )
              : (
                <NoData widths="100%" />
              )}
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>

  );
});
export default DetailLeft;
