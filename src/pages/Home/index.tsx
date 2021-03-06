/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import React, { useState, MouseEventHandler, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Spinner,
  Image,
  Flex,
  Text,
  Center,
  Button,
  SimpleGrid,
  useMediaQuery,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import SwiperCore, {
  Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import CategorySelector from '../../components/CategorySelector';
import OrderCard from '../../components/OrderCard';
import OrderCardH5 from '../../components/OrderCardH5';
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
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');
  const { t } = useTranslation();
  const [selectId, setSelectId] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [pageParam, setPageParamr] = useState(0);
  const [pageParamE, setPageParamE] = useState(0);
  const [pageParamC, setPageParamC] = useState(0);

  const {
    data: hotNftsData, isLoading: hotNftsIsLoading,
    // refetch: refetchHot,
  } = useHotNfts(selectId);
  const {
    data: expensiveNftsData, isLoading: expensiveNftsIsLoading,
    // refetch: refetchExpensive,
  } = useExpensiveNfts(selectId);
  const {
    data: cheapNftsData, isLoading: cheapNftsIsLoading,
    // refetch: refetchCheap,
  } = useCheapNfts(selectId);

  const { data: categoriesData } = useCategories();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    getBlock().then((res) => {
      setRemainingTime(res);
    });
  }, []);
  // console.log(remainingTime, 1);

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectId(event.currentTarget.id);
    setPageParamr(0);
    setPageParamE(0);
    setPageParamC(0);
  };

  return (
    <>
      {isLargerThan700
        ? (
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
                          }
                        }}
                        _hover={{
                          background: '#000000',
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
                        isDisabled={!(pageParam < 4) || !hotNftsData?.nfts.slice(0 + (pageParam + 1) * 4, 4 + (pageParam + 1) * 4).length}
                        onClick={() => {
                          if (pageParam < 5) {
                            setPageParamr(pageParam + 1);
                          }
                        }}
                        _hover={{
                          background: '#000000',
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
                    ) : hotNftsData?.nfts.slice(0 + pageParam * 4, 4 + pageParam * 4).length
                      ? (
                        <SimpleGrid columns={[1, 2, 2, 3, 4]} direction="row" spacing="26px">
                          {hotNftsData.nfts.slice(0 + pageParam * 4, 4 + pageParam * 4).map((order) => (
                            <Flex
                              key={order?.metadata.name}
                            >
                              <OrderCard nft={order} remainingTime={remainingTime} />
                            </Flex>
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
                          }
                        }}
                        _hover={{
                          background: '#000000',
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
                        isDisabled={!(pageParamE < 4) || !expensiveNftsData?.nfts.slice(0 + (pageParamE + 1) * 4, 4 + (pageParamE + 1) * 4).length}
                        onClick={() => {
                          if (pageParamE < 5) {
                            setPageParamE(pageParamE + 1);
                          }
                        }}
                        _hover={{
                          background: '#000000',
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
                    ) : (expensiveNftsData && expensiveNftsData.nfts.slice(0 + pageParamE * 4, 4 + pageParamE * 4).length
                      ? (
                        <SimpleGrid columns={[1, 2, 2, 3, 4]} direction="row" spacing="26px">
                          {expensiveNftsData.nfts.slice(0 + pageParamE * 4, 4 + pageParamE * 4).map((order) => (
                            <Flex
                              key={order?.metadata.name}
                            >
                              <OrderCard nft={order} remainingTime={remainingTime} />
                            </Flex>
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
                        isDisabled={!(pageParamC < 4) || !cheapNftsData?.nfts.slice(0 + (pageParamC + 1) * 4, 4 + (pageParamC + 1) * 4).length}
                        onClick={() => {
                          if (pageParamC < 5) {
                            setPageParamC(pageParamC + 1);
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
                    ) : cheapNftsData?.nfts.slice(0 + pageParamC * 4, 4 + pageParamC * 4).length
                      ? (
                        <SimpleGrid columns={[1, 2, 2, 3, 4]} direction="row" spacing="26px">
                          {cheapNftsData.nfts.slice(0 + pageParamC * 4, 4 + pageParamC * 4).map((order) => (
                            <Flex
                              key={order?.metadata.name}
                            >
                              <OrderCard nft={order} remainingTime={remainingTime} />
                            </Flex>
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
        ) : (
          <MainContainer title={t('Home.title')}>
            <Flex
              width="100%"
              justifyContent="center"
              p="0 15px"
              boxSizing="border-box"
            >
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
                      fontSize="10.5px"
                      fontFamily="TTHoves-Bold, TTHove"
                      fontWeight="bold"
                      color="#000000"
                      lineHeight="38px"
                    >
                      {t('Home.hottest')}
                    </Text>
                  </Flex>
                  {hotNftsIsLoading
                    ? (
                      <Center height="261px">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                      </Center>
                    ) : hotNftsData?.nfts.slice(0 + pageParam * 4, 4 + pageParam * 4).length
                      ? (
                        <Swiper
                          slidesPerView="auto"
                          spaceBetween={20}
                          className="mySwiper"
                        >
                          {hotNftsData?.nfts.map((order) => (
                            <SwiperSlide key={order.id}>
                              <OrderCardH5 nft={order} remainingTime={remainingTime} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )
                      : (
                        <Flex
                          width="100%"
                          height="261px"
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
                      fontSize="10.5px"
                      fontFamily="TTHoves-Bold, TTHove"
                      fontWeight="bold"
                      color="#000000"
                      lineHeight="38px"
                    >
                      {t('Home.expensive')}

                    </Text>

                  </Flex>
                  {expensiveNftsIsLoading
                    ? (
                      <Center height="261px">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                      </Center>
                    ) : (expensiveNftsData?.nfts
                      ? (
                        <Swiper
                          slidesPerView="auto"
                          spaceBetween={20}
                          className="mySwiper"
                        >

                          {expensiveNftsData?.nfts.map((order) => (
                            <SwiperSlide key={order.id}>
                              <OrderCardH5 nft={order} remainingTime={remainingTime} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )
                      : (
                        <Flex
                          width="100%"
                          height="261px"
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
                      fontSize="10.5px"
                      fontFamily="TTHoves-Bold, TTHove"
                      fontWeight="bold"
                      color="#000000"
                      lineHeight="38px"
                    >
                      {t('Home.cheapest')}

                    </Text>
                  </Flex>
                  {cheapNftsIsLoading
                    ? (
                      <Center height="261px">
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                      </Center>
                    ) : cheapNftsData?.nfts
                      ? (

                        <Swiper
                          slidesPerView="auto"
                          spaceBetween={20}
                          className="mySwiper"
                        >

                          {cheapNftsData?.nfts.map((order) => (
                            <SwiperSlide key={order.id}>
                              <OrderCardH5 nft={order} remainingTime={remainingTime} />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )
                      : (
                        <Flex
                          width="100%"
                          height="261px"
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
        )}
    </>
  );
};

export default Home;
