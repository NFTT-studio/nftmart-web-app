/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/no-children-prop */
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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Identicon from '@polkadot/react-identicon';
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
  collectionsData: {
    collection: {
      metadata: {
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
}
const DetailLeft: FC<Props> = (({
  nftData,
  collectionsData,
}) => {
  const pictureType = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const videoType = ['mp4', 'webm'];
  const audioType = ['mp3', 'wav', 'ogg'];
  const ICONS = [
    { icon: WEBSITE.default, name: 'website', linkPrefix: '' },
    { icon: DISCORD.default, name: 'discord', linkPrefix: 'https://discord.gg/' },
    { icon: TWITTER.default, name: 'twitter', linkPrefix: 'https://twitter.com/' },
    { icon: IconIns.default, name: 'ins', linkPrefix: 'https://www.instagram.com/' },
    { icon: medium.default, name: 'medium', linkPrefix: 'https://www.medium.com/@' },
    { icon: telegram.default, name: 'telegram', linkPrefix: 'https://t.me/' },
  ];
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : null);
  const collectionName = collectionsData?.collection?.metadata?.name;
  const collectionDescription = collectionsData?.collection?.metadata?.description;
  const links = collectionsData?.collection?.metadata?.links;
  const ICON_LIST = ICONS.map((item, index) => ({
    src: item.icon,
    id: index,
    link: links ? links[item.name] ? item.linkPrefix + links[item.name] : '' : '',
  }));
  const newLink = ICON_LIST.filter((item) => item.link !== '');
  const fileType = nftData?.nftInfo?.metadata?.fileType;
  const { t } = useTranslation();
  return (
    <Flex maxWidth="560px" w="100%" flexDirection="column">
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
          {pictureType.indexOf(fileType) > -1
            ? (
              <Flex
                m="20px"
                w="520px"
                minH="260px"
                justifyContent="center"
              >
                <Link
                  target="_blank"
                  href={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`}
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#3D00FF"
                >
                  <Image
                    // cursor="pointer"
                    maxWidth="520px"
                    objectFit="contain"
                    height="auto"
                    maxHeight="1040px"
                    src={nftData?.nftInfo?.metadata?.fileType === 'gif' ? `${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.logoUrl}` : `${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}!detail`}
                  />
                </Link>
              </Flex>
            )
            : (
              videoType.indexOf(fileType) > -1
                ? (
                  <Box
                    m="20px"
                    width="520px"
                    height="auto"
                  >
                    <video
                      width="100%"
                      height="auto"
                      controls
                      poster={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.previewUrl}!detail`}
                    >
                      <source style={{ height: 'auto' }} src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`} />
                    </video>
                  </Box>
                )
                : (
                  <Box
                    m="20px"
                    width="520px"
                    height="auto"
                  >
                    <Link
                      target="_blank"
                      href={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.previewUrl}`}
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#3D00FF"
                    >
                      <Image
                        width="100%"
                        height="auto"
                        src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.previewUrl}!detail`}
                      />
                    </Link>
                    <ReactAudioPlayer
                      style={{
                        width: '100%',
                      }}
                      src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata.logoUrl}`}
                      autoPlay
                      controls
                    />
                  </Box>
                )
            )}

          {/* {nftData?.nftInfo?.metadata?.fileType === 'mp4' || nftData?.nftInfo?.metadata?.fileType === 'mp3'
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

            )} */}
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
        <Accordion width="560px" defaultIndex={[0, 1]} allowMultiple>
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
                  w="auto"
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
                <Link
                  as={RouterLink}
                  to={`/account/${nftData?.nftInfo?.creator_id}${nftData?.nftInfo?.creator?.name ? `-${nftData?.nftInfo?.creator?.name}` : ''}/owned`}
                  onClick={() => {
                    localStorage.setItem('ButtonSelect', '1');
                  }}
                >
                  {nftData?.nftInfo?.creator?.avatar ? (
                    <Image
                      mr="4px"
                      w="50px"
                      h="auto"
                      borderRadius="50%"
                      border="1px solid #D3D5DC"
                      src={`${PINATA_SERVER}user/${nftData?.nftInfo?.creator?.avatar}` || HeadPortrait.default}
                    />
                  ) : (
                    <Identicon
                      className="creatorAvatar"
                      value={nftData?.nftInfo?.creator?.id}
                    />
                  )}
                </Link>
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
                      to={`/account/${nftData?.nftInfo?.creator_id}${nftData?.nftInfo?.creator?.name ? `-${encodeURIComponent(nftData?.nftInfo?.creator?.name)}` : ''}/owned`}
                      m="0 3px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color="#3D00FF"
                      onClick={() => {
                        localStorage.setItem('ButtonSelect', '1');
                      }}
                    >
                      {nftData?.nftInfo?.creator?.name || formatAddress(nftData?.nftInfo?.creator_id)}
                    </Link>
                  </Text>
                </Text>
              </Flex>
              <Box
                className="markdown"
              >
                {nftData?.nftInfo?.metadata.description ? <ReactMarkdown children={`${nftData?.nftInfo?.metadata.description}`} remarkPlugins={[remarkGfm]} />
                  : ''}
              </Box>
              {/* <Box
                className="braft-output-content"
                dangerouslySetInnerHTML={{ __html: nftData?.nftInfo?.metadata.description }}
              /> */}
            </AccordionPanel>
          </AccordionItem>
          {nftData?.nftInfo?.metadata?.properties?.length
            ? (
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
                      w="auto"
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
                {nftData?.nftInfo?.metadata?.properties?.length
                  ? (
                    <AccordionPanel
                      p="16px 20px 4px 20px"
                      display="flex"
                      flexFlow="row wrap"
                      justifyContent="space-between"
                    >
                      {nftData?.nftInfo?.metadata?.properties.map((item) => (
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
                            {item.key}
                          </Text>
                          <Text
                            m="8px 0"
                            fontSize="14px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {item.value}
                          </Text>
                          {/* <Text
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            1.23% have this trait
                          </Text> */}
                        </Flex>
                      ))}

                    </AccordionPanel>
                  )
                  : (
                    <AccordionPanel p="0px">
                      <NoData widths="100%" />
                    </AccordionPanel>
                  )}

              </AccordionItem>
            ) : null}

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
                  w="auto"
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
                    <ReactMarkdown children={`${collectionDescription}`} remarkPlugins={[remarkGfm]} />
                  </Text>

                  <Flex>
                    {newLink.map((item, index) => (
                      <Link
                        href={item.link}
                      >
                        <Box
                          key="index"
                          width="40px"
                          height="40px"
                          borderRadius={index === 0 ? '4px 0px 0px 4px' : index === newLink.length - 1 ? '0px 4px 4px 0px' : ''}
                          borderTop="1px solid #E5E5E5"
                          borderBottom="1px solid #E5E5E5"
                          borderLeft="1px solid #E5E5E5"
                          borderRight={index === newLink.length - 1 ? '1px solid #E5E5E5' : ''}
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
