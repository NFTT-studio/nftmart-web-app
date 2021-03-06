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
  SimpleGrid,
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
                  <SimpleGrid
                    display="grid"
                    width="100%"
                    minChildWidth="320px"
                    // gridTemplateColumns="repeat(auto-fit, minmax(280px,320px))"
                    spacing="20px"
                  >
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
                          src={item?.featured_image
                            ? `${PINATA_SERVER}user/${item?.featured_image}?imageMogr2/thumbnail/x120/interlace/0`
                            : AccountBanner.default}
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
                        <Link
                          as={RouterLink}
                          to={`/account/${item?.id}${item?.name ? `-${encodeURIComponent(item?.name)}` : ''}/collections`}
                        >
                          <Image
                            border="3px solid #FFFFFF"
                            boxShadow="0px 6px 20px 0px #D3D5DC"
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
                        </Link>
                        <Link
                          as={RouterLink}
                          to={`/account/${item?.id}${item?.name ? `-${encodeURIComponent(item?.name)}` : ''}/collections`}
                        >
                          <Text
                            marginTop="76px"
                            w="100%"
                            fontSize="18px"
                            fontFamily="TTHoves-DemiBold, TTHoves"
                            fontWeight="600"
                            color="rgba(0, 0, 0, 0.85)"
                            lineHeight="22px"
                            letterSpacing="1px"
                            textAlign="center"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {item?.name || formatAddress(item?.id)}
                          </Text>
                        </Link>
                        <Flex
                          mt="16px"
                          minHeight="24px"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {item?.instagram
                            ? (
                              <Link
                                m="0 16.5px"
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
                                m="0 16.5px"
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
                                m="0 16.5px"
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
                        {item.summary ? (
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
                        ) : ''}
                      </Flex>
                    ))}
                  </SimpleGrid>
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
