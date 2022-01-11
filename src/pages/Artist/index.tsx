/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, MouseEventHandler, ChangeEventHandler,
} from 'react';
import {
  Spinner,
  Flex,
  Container,
  Box,
  Text,
  InputGroup,
  Input,
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
  IconAllStateone,
  Emptyimg,
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
        {artistData?.map((item, index) => (
          <Flex
            cursor="pointer"
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
            <Text
              p="0 13px"
              marginTop="60px"
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
              whiteSpace="nowrap"
              textAlign="start"
            >
              Masai毕业于中国中央美术学院，作品参加过各种国际展览。
              受邀参加2021冬奥会艺术主题创作活动创作的油画《美女的新衣》，
              在2021年春季佳士得拍卖会成交价32万元人民币。多幅作品被当代艺术馆收藏。
            </Text>
          </Flex>
        ))}
      </Container>

    </MainContainer>
  );
};

export default Artist;
