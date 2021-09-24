/* eslint-disable no-nested-ternary */
import React, { useState, MouseEventHandler, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Spinner,
  Image,
  Stack,
  Flex,
  Text,
  Center,
  Box,
  Button,
  SimpleGrid,
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
  Historyempty,
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
    setPageParamr(0);
    setPageParamE(0);
    setPageParamC(0);
    setSelectId(event.currentTarget.id);
  };

  return (
    <MainContainer title={t('Home.title')}>
      <Banner />
      {categoriesData
        ? (
          <Flex width="100%" maxWidth="1364px">
            <CategorySelector list={categoriesData.categories} selectId={selectId} handleSelect={handleSelect} />
          </Flex>
        )
        : null}

      <Flex width="100%" maxWidth="1364px" justifyContent="center">
        <Flex width="100%" maxWidth="1364px" flexDirection="column">
          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="38px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text
                fontSize="32px"
                fontFamily="TTHoves-Bold, TTHove"
                fontWeight="bold"
                color="#000000"
                lineHeight="38px"
              >
                {t('Home.hottest')}

              </Text>
              <Flex>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  h="32px"
                  w="32px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={pageParam === 0}
                  onClick={() => {
                    if (pageParam > 0) {
                      setPageParamr(pageParam - 1);
                      setTimeout(() => {
                        refetchHot();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Button>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  ml="20px"
                  h="32px"
                  w="32px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={!(pageParam + 1 < Number(hotNftsData?.pageInfo.pageSize))}
                  onClick={() => {
                    if (pageParam + 1 < Number(hotNftsData?.pageInfo.pageSize)) {
                      setPageParamr(pageParam + 1);
                      setTimeout(() => {
                        refetchHot();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Button>
              </Flex>
            </Flex>
            {hotNftsIsLoading
              ? (
                <Center height="396px">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : hotNftsData?.orders.length
                ? (
                  <SimpleGrid columns={[2, 4]} direction="row" spacing="26px">
                    {hotNftsData.orders.map((order) => (
                      <OrderCard nft={order} remainingTime={remainingTime} />
                    ))}
                  </SimpleGrid>
                )
                : (
                  <Flex
                    width="100%"
                    height="353px"
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
          </Flex>

          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="38px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text
                fontSize="32px"
                fontFamily="TTHoves-Bold, TTHove"
                fontWeight="bold"
                color="#000000"
                lineHeight="38px"
              >
                {t('Home.expensive')}

              </Text>
              <Flex>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  h="32px"
                  w="32px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={pageParamE === 0}
                  onClick={() => {
                    if (pageParamE > 0) {
                      setPageParamE(pageParamE - 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Button>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  ml="20px"
                  h="32px"
                  w="32px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={!(pageParamE + 1 < Number(expensiveNftsData?.pageInfo.pageSize))}
                  onClick={() => {
                    if (expensiveNftsData && pageParamE + 1 < expensiveNftsData?.pageInfo.pageSize) {
                      setPageParamE(pageParamE + 1);
                      setTimeout(() => {
                        refetchExpensive();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Button>
              </Flex>
            </Flex>
            {expensiveNftsIsLoading
              ? (
                <Center height="396px">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : (expensiveNftsData?.orders.length
                ? (
                  <SimpleGrid columns={[2, 4]} direction="row" spacing="26px">
                    {expensiveNftsData.orders.map((order) => (
                      <OrderCard nft={order} remainingTime={remainingTime} />
                    ))}
                  </SimpleGrid>
                )
                : (
                  <Flex
                    width="100%"
                    height="353px"
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
                ))}
          </Flex>
          <Flex width="100%" flexDirection="column" mt="40px">
            <Flex
              h="38px"
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb="19px"
            >
              <Text
                fontSize="32px"
                fontFamily="TTHoves-Bold, TTHove"
                fontWeight="bold"
                color="#000000"
                lineHeight="38px"
              >
                {t('Home.cheapest')}

              </Text>
              <Flex>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  h="32px"
                  w="32px"
                  background="#000000"
                  borderRadius="50%"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={pageParamC === 0}
                  onClick={() => {
                    if (pageParamC > 0) {
                      setPageParamC(pageParamC - 1);
                      setTimeout(() => {
                        refetchCheap();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconLeftw.default}
                  />
                </Button>
                <Button
                  as="button"
                  minWidth="0px"
                  padding="0px"
                  ml="20px"
                  h="32px"
                  w="32px"
                  borderRadius="50%"
                  background="#000000"
                  justifyContent="center"
                  alignItems="center"
                  isDisabled={!(pageParamC + 1 < Number(cheapNftsData?.pageInfo.pageSize))}
                  onClick={() => {
                    if (cheapNftsData && pageParamC + 1 < cheapNftsData?.pageInfo.pageSize) {
                      setPageParamC(pageParamC + 1);
                      setTimeout(() => {
                        refetchCheap();
                      }, 1);
                    }
                  }}
                >
                  <Image
                    height="18px"
                    src={IconRightw.default}
                  />
                </Button>
              </Flex>
            </Flex>
            {cheapNftsIsLoading
              ? (
                <Center height="396px">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </Center>
              ) : cheapNftsData?.orders.length
                ? (
                  <SimpleGrid columns={[2, 4]} direction="row" spacing="26px">
                    {cheapNftsData.orders.map((order) => (
                      <OrderCard nft={order} remainingTime={remainingTime} />
                    ))}
                  </SimpleGrid>
                )
                : (
                  <Flex
                    width="100%"
                    height="353px"
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

          </Flex>
        </Flex>
      </Flex>
    </MainContainer>
  );
};

export default Home;
