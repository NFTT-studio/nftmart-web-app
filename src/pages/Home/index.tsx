import React, { useState, MouseEventHandler } from 'react';
import {
  Spinner,
  Box,
  Image,
  Stack,
  Flex,
  Text,
  Button,
  Center,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  Scrollbar,
} from 'swiper';
import CategorySelector from '../../components/CategorySelector';
import OrderCard from '../../components/OrderCard ';
import useBanner from '../../hooks/reactQuery/useBanner';
import { useCheapNfts, useExpensiveNfts, useHotNfts } from '../../hooks/reactQuery/useNfts';
import useCategories from '../../hooks/reactQuery/useCategories';
import MainContainer from '../../layout/MainContainer';

import {
  IconHome,
  IconCheapest,
  iconExpensive,
  BannerBg,
} from '../../assets/images';

import 'swiper/swiper.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';

SwiperCore.use([Scrollbar]);

const Home = () => {
  const { t } = useTranslation();
  const [selectId, setSelectId] = useState('');

  const { data: hotNftsData, isLoading: hotNftsIsLoading } = useHotNfts(selectId);
  const { data: expensiveNftsData, isLoading: expensiveNftsIsLoading } = useExpensiveNfts(selectId);
  const { data: cheapNftsData, isLoading: cheapNftsIsLoading } = useCheapNfts(selectId);

  const { data: bannerData, isLoading: bannerIsLoading } = useBanner();
  const { data: categoriesData, isLoading: categoriesIsLoading } = useCategories();

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectId(event.currentTarget.id);
  };

  return (
    <MainContainer title={t('Home.title')}>
      <Flex
        w="100vw"
        height="820px"
        background="#000000"
        justifyContent="center"
        mb="40px"
      >
        <Flex maxWidth="1364px" position="relative">
          <Image maxWidth="1364px" width="100%" position="relative" src={BannerBg.default} alt="banner" />
          <Flex
            color="white"
            flexDirection="column"
            w="579px"
            alignItems="flex-start"
            justifyContent="flex-start"
            position="absolute"
            top="172px"
            left="100px"
            p={4}
          >
            <Text
              fontSize="64px"
              fontFamily="TTHoves-Thin, TTHoves"
              fontWeight="100"
              color="#FFFFFF"
              lineHeight="75px"
            >
              {t('banner.titleOne')}
            </Text>
            <Text
              w="579px"
              fontFamily="TTHoves-Bold, TTHoves"
              fontWeight="bold"
              color="#FFFFFF"
              lineHeight="75px"
              letterSpacing="2px"
              fontSize="64px"
            >
              {t('banner.titleTwo')}
            </Text>
            <Text
              mt="3px"
              w="579px"
              fontFamily="TTHoves-Bold, TTHoves"
              fontWeight="100"
              color="#999999"
              lineHeight="29px"
              letterSpacing="2px"
              fontSize="24px"
            >
              {t('banner.content')}
            </Text>
            <Button
              mt="35px"
              width="200px"
              height="60px"
              background="#FFFFFF"
              borderRadius="4px"
              fontSize="20px"
              fontFamily="TTHoves-Bold, TTHoves"
              fontWeight="bold"
              color="#000000"
            >
              {t('banner.button')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {categoriesData
        ? <CategorySelector list={categoriesData.categories} selectId={selectId} handleSelect={handleSelect} />
        : null}

      <Flex width="100%" justifyContent="center">
        <Flex width="1364px" flexDirection="column">

          {hotNftsIsLoading || expensiveNftsIsLoading || cheapNftsIsLoading || bannerIsLoading || categoriesIsLoading
            ? (
              <Center height="100%">
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
              </Center>
            ) : null}
          {hotNftsData?.orders.length
            ? (
              <Flex width="100%" flexDirection="column" mt="40px">
                <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="40px">
                  <Box as="img" src={IconHome.default} alt="" w="18px" h="18px" mr="8px" />
                  <Text>{t('Home.hottest')}</Text>
                </Flex>
                <Stack direction="row" height="364px">
                  <Swiper
                    scrollbar={{ draggable: true }}
                    slidesPerView={5}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 4,
                      },
                      1024: {
                        slidesPerView: 5,
                      },
                    }}
                    className="mySwiper"
                  >

                    {hotNftsData.orders.map((order) => (
                      <SwiperSlide key={order.id}>
                        <OrderCard nft={order} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Stack>
              </Flex>
            )
            : null}
          {expensiveNftsData?.orders.length ? (
            <Flex width="100%" flexDirection="column" mt="40px">
              <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="40px">
                <Box as="img" src={iconExpensive.default} alt="" w="18px" h="18px" mr="8px" />
                <Text>{t('Home.expensive')}</Text>
              </Flex>
              <Stack direction="row" height="364px">
                <Swiper
                  scrollbar={{ draggable: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 4,
                    },
                    1024: {
                      slidesPerView: 5,
                    },
                  }}
                  className="mySwiper"
                >
                  {expensiveNftsData?.orders.map((order) => (
                    <SwiperSlide key={order.id}>
                      <OrderCard nft={order} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Stack>
            </Flex>
          ) : null}
          {expensiveNftsData?.orders.length
            ? (
              <Flex width="100%" flexDirection="column" mt="40px">
                <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="40px">
                  <Box as="img" src={IconCheapest.default} alt="" w="18px" h="18px" mr="8px" />
                  <Text>{t('Home.cheapest')}</Text>
                </Flex>
                <Stack direction="row" height="364px">
                  <Swiper
                    scrollbar={{ draggable: true }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 4,
                      },
                      1024: {
                        slidesPerView: 5,
                      },
                    }}
                    className="mySwiper"
                  >
                    {cheapNftsData?.orders.map((order) => (
                      <SwiperSlide key={order.id}>
                        <OrderCard nft={order} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Stack>
              </Flex>
            )
            : null}

        </Flex>
      </Flex>
    </MainContainer>
  );
};

export default Home;
