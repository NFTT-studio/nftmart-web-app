/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Link as RouterLink,
} from 'react-router-dom';
import {
  Spinner,
  Flex,
  Container,
  Link,
  Text,
  Image,
  Center,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import MainContainer from '../../layout/MainContainer';
import useArtist from '../../hooks/reactQuery/useArtist';

import {
  AccountBanner,
  HeadPortrait,
  WEBSITE,
  TWITTER,
  IconIns,
  Historyempty,
} from '../../assets/images';
import {
  DEFAULT_PAGE_LIMIT,
  PINATA_SERVER,
} from '../../constants';

const Artist = () => {
  const { t } = useTranslation();
  const { data: artistData, isLoading: userDataLoading, refetch: fetchUserData } = useArtist();
  const formatAddress = (addr: string) => (addr ? `${addr?.slice(0, 4)}...${addr?.slice(-4)}` : '');
  console.log(artistData);
  return (
    <MainContainer title={`${t('Browsing.title')}|${t('Home.title')}`}>
      <Container
        className="container"
        w="100%"
        mt="40px"
        display="flex"
        flexFlow="row wrap"
        justifyContent="space-between"
        maxWidth="1440px"
        p="0 35px"
      >
        {userDataLoading
          ? (
            <Center width="100%" height="100vh">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Center>
          )
          : (
            <>
              {artistData && artistData.length > 0
                ? (
                  <>
                    {artistData?.map((item, index) => (
                      <Flex
                        width="320px"
                        height="420px"
                        background="#FFFFFF"
                        borderRadius="10px"
                        border="1px solid #979797"
                        marginBottom="36px"
                        display="column"
                        position="relative"
                        alignItems="center"
                      >
                        <Image
                          borderRadius="10px 10px 0 0"
                          w="100%"
                          h="120px"
                          objectFit="cover"
                          src={item?.featured_image ? `${PINATA_SERVER}user/${item?.featured_image}` : AccountBanner.default}
                          fallback={(
                            <Center
                              borderRadius="10px 10px 0 0"
                              w="100%"
                              h="120px"
                            >
                              <Spinner />
                            </Center>
                          )}
                        />
                        <Image
                          position="absolute"
                          background="#FFFFFF"
                          width="120px"
                          borderRadius="50%"
                          height="120px"
                          left="calc(50% - 60px)"
                          top="60px"
                          objectFit="cover"
                          src={`${PINATA_SERVER}user/${item?.avatar}` || HeadPortrait.default}
                          fallback={(
                            <Center
                              width="120px"
                              height="120px"
                              position="absolute"
                              borderRadius="50%"
                              left="calc(50% - 60px)"
                              top="60px"
                              objectFit="cover"
                            >
                              <Spinner />
                            </Center>
                          )}
                        />
                        <Text
                          marginTop="60px"
                          w="100%"
                          fontSize="18px"
                          fontFamily="TTHoves-DemiBold, TTHoves"
                          fontWeight="600"
                          color="rgba(0, 0, 0, 0.85)"
                          lineHeight="22px"
                          letterSpacing="1px"
                          textAlign="center"
                        >
                          {item?.name || formatAddress(item?.id)}
                        </Text>
                        <Flex
                          mt="16px"
                          p="0 89px"
                          minHeight="24px"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {item?.instagram
                            ? (
                              <Link
                                target="_blank"
                                href={`https://www.instagram.com/${item?.instagram}}`}
                              >
                                <Image
                                  cursor="pointer"
                                  width="24px"
                                  height="auto"
                                  src={IconIns.default}
                                />
                              </Link>
                            ) : ''}
                          {item?.instagram
                            ? (
                              <Link
                                target="_blank"
                                href={`https://twitter.com/${item.twitter}}`}
                              >
                                <Image
                                  cursor="pointer"
                                  width="24px"
                                  height="auto"
                                  src={TWITTER.default}
                                />
                              </Link>
                            ) : ''}
                          {item?.website
                            ? (
                              <Link
                                target="_blank"
                                href={item.website}
                              >
                                <Image
                                  cursor="pointer"
                                  width="24px"
                                  height="auto"
                                  src={WEBSITE.default}
                                />
                              </Link>
                            ) : ''}

                        </Flex>
                        <Link
                          as={RouterLink}
                          to={`/account/${item?.id}${item?.name ? `-${encodeURIComponent(item?.name)}` : ''}/profile`}
                        >
                          <Text
                            cursor="pointer"
                            p="0 13px"
                            marginTop="23px"
                            w="100%"
                            h="100px"
                            fontSize="14px"
                            fontFamily="PingFangSC-Semibold, PingFang SC"
                            fontWeight="600"
                            color="rgba(0, 0, 0, 0.85)"
                            lineHeight="20px"
                            letterSpacing="1px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            display="-webkit-box"
                            style={{
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '5',
                            }}
                            // -webkit-box-orient= "vertical"
                            // -webkit-line-clamp= "2"
                            textAlign="start"
                          >
                            {item.summary}
                          </Text>
                        </Link>
                      </Flex>
                    ))}
                  </>
                )
                : (
                  <Flex
                    width="100%"
                    height="100vh"
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
                      {t('Detail.noDataYet')}
                    </Text>
                  </Flex>
                )}
            </>
          )}

      </Container>

    </MainContainer>
  );
};

export default Artist;
