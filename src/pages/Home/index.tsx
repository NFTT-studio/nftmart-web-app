import React, { useState, MouseEventHandler, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Spinner,
  Image,
  Stack,
  Flex,
  Text,
  Center,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SwiperCore, {
  Scrollbar,
} from 'swiper';
import CategorySelector from '../../components/CategorySelector';
import OrderCard from '../../components/OrderCard ';
import useBanner from '../../hooks/reactQuery/useBanner';
import { useCheapNfts, useExpensiveNfts, useHotNfts } from '../../hooks/reactQuery/useNfts';
import useCategories from '../../hooks/reactQuery/useCategories';
import MainContainer from '../../layout/MainContainer';
import Banner from './Banner';
import { getBlock } from '../../polkaSDK/api/getBlock';

import {
  IconLeftw,
  IconRightw,
} from '../../assets/images';

import 'swiper/swiper.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';

SwiperCore.use([Scrollbar]);

const Home = () => {
  const { t } = useTranslation();
  const [selectId, setSelectId] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [number, setNumber] = useState(4);
  const [pageParam, setPageParamr] = useState(0);
  const [pageParamE, setPageParamE] = useState(0);
  const [pageParamC, setPageParamC] = useState(0);

  const {
    data: hotNftsData, isLoading: hotNftsIsLoading,
    refetch: refetchHot,
  } = useHotNfts(number, pageParam, selectId);
  const {
    data: expensiveNftsData, isLoading: expensiveNftsIsLoading,
    refetch: refetchExpensive,
  } = useExpensiveNfts(number, pageParamE, selectId);
  const {
    data: cheapNftsData, isLoading: cheapNftsIsLoading,
    refetch: refetchCheap,
  } = useCheapNfts(number, pageParamC, selectId);

  const { data: bannerData, isLoading: bannerIsLoading } = useBanner();
  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);
  // console.log(remainingTime, 1);

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectId(event.currentTarget.id);
  };

  return (
    <MainContainer title={t('Home.title')}>
      <Banner />
      {categoriesData
        ? (
          <Flex width="1364px">
            <CategorySelector list={categoriesData.categories} selectId={selectId} handleSelect={handleSelect} />
          </Flex>
        )
        : null}

      <Flex width="100%" minWidth="1364px" justifyContent="center">
        <Flex width="1364px" flexDirection="column">

          {hotNftsIsLoading || expensiveNftsIsLoading || cheapNftsIsLoading || bannerIsLoading || categoriesIsLoading
            ? (
              <Center height="100%">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            ) : null}

          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="21px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text>{t('Home.hottest')}</Text>
              <Flex h="21px">
                <Flex
                  h="25px"
                  w="25px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (pageParam > 0) {
                      setPageParamr(pageParam - 1);
                      setTimeout(() => {
                        refetchHot();
                      }, 500);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Flex>
                <Flex
                  ml="20px"
                  h="25px"
                  w="25px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (pageParam < hotNftsData?.pageInfo.totalNum) {
                      setPageParamr(pageParam + 1);
                      setTimeout(() => {
                        refetchHot();
                      }, 500);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Flex>
              </Flex>
            </Flex>
            {hotNftsData?.orders.length
              ? (
                <Stack direction="row" height="353px" spacing="20px">
                  {hotNftsData.orders.map((order) => (
                    <OrderCard nft={order} remainingTime={remainingTime} />
                  ))}
                </Stack>
              )
              : null}
          </Flex>

          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="21px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text>{t('Home.expensive')}</Text>
              <Flex h="21px">
                <Flex
                  h="25px"
                  w="25px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (pageParamE > 0) {
                      setPageParamE(pageParamE - 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 10);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Flex>
                <Flex
                  ml="20px"
                  h="25px"
                  w="25px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (expensiveNftsData && pageParamE + 1 < expensiveNftsData?.pageInfo.totalNum) {
                      setPageParamE(pageParamE + 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 10);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Flex>
              </Flex>
            </Flex>
            {expensiveNftsData?.orders.length
              ? (
                <Stack direction="row" height="353px" spacing="20px">
                  {expensiveNftsData.orders.map((order) => (
                    <OrderCard nft={order} remainingTime={remainingTime} />
                  ))}
                </Stack>
              )
              : null}
          </Flex>
          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="21px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text>{t('Home.cheapest')}</Text>
              <Flex h="21px">
                <Flex
                  h="25px"
                  w="25px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (pageParamC > 0) {
                      setPageParamC(pageParamC - 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 10);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Flex>
                <Flex
                  ml="20px"
                  h="25px"
                  w="25px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    if (cheapNftsData && pageParamC + 1 < cheapNftsData?.pageInfo.totalNum) {
                      setPageParamC(pageParamC + 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 10);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Flex>
              </Flex>
            </Flex>
            {cheapNftsData?.orders.length
              ? (
                <Stack direction="row" height="353px" spacing="20px">
                  {cheapNftsData.orders.map((order) => (
                    <OrderCard nft={order} remainingTime={remainingTime} />
                  ))}
                </Stack>
              )
              : null}
          </Flex>
        </Flex>
      </Flex>
    </MainContainer>
  );
};

export default Home;
