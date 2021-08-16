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
import MotionBox from './MotionBox';

import {
  IconHome,
  IconCheapest,
  iconExpensive,
} from '../../assets/images';
import {
  banner12,
  banner13,
  banner21,
  banner22,
  banner23,
  banner24,
  banner31,
  banner34,
  banner35,
  banner36,
  bannerLeft,
} from '../../assets/banner';

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
        <Flex maxWidth="1364px" minWidth="1364px" position="relative" justifyContent="space-between">
          <Flex height="100%" alignItems="center">
            <Image
              width="30px"
              height="622px"
              src={bannerLeft.default}
            />
          </Flex>
          <Flex
            maxWidth="1364px"
            width="100%"
            position="relative"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            <Flex>
              <Flex
                width="615"
                height="410px"
              >
                <MotionBox
                  backgroundColor="#000"
                  cursor="pointer"
                  _hover={{ boxShadow: 'lg' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    width="410px"
                    height="410px"
                    border="1px solid #4D4D4D"
                    src={banner22.default}
                  />
                </MotionBox>

                <Flex
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                >
                  <MotionBox
                    backgroundColor="#000"
                    cursor="pointer"
                    _hover={{ boxShadow: 'lg' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      width="205px"
                      height="205px"
                      border="1px solid #4D4D4D"
                      src={banner12.default}
                    />
                  </MotionBox>
                  <MotionBox
                    backgroundColor="#000"
                    cursor="pointer"
                    _hover={{ boxShadow: 'lg' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      width="205px"
                      height="205px"
                      border="1px solid #4D4D4D"
                      src={banner13.default}
                    />
                  </MotionBox>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner21.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner22.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner23.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner24.default}
                />
              </MotionBox>
            </Flex>
            <Flex
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner31.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner34.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner34.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner34.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner35.default}
                />
              </MotionBox>
              <MotionBox
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  width="205px"
                  height="205px"
                  border="1px solid #4D4D4D"
                  src={banner36.default}
                />
              </MotionBox>
            </Flex>
          </Flex>
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
              fontFamily="TTHoves-Thin, TTHoves"
              fontWeight="100"
              color="#999999"
              lineHeight="29px"
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
        ? <Flex width="1364px"><CategorySelector list={categoriesData.categories} selectId={selectId} handleSelect={handleSelect} /></Flex>
        : null}

      <Flex width="100%" minWidth="1364px" justifyContent="center">
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
                <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="19px">
                  <Box as="img" src={IconHome.default} alt="" w="18px" h="18px" mr="8px" />
                  <Text>{t('Home.hottest')}</Text>
                </Flex>
                <Stack direction="row" height="353px">
                  <Swiper
                    scrollbar={{ draggable: true }}
                    slidesPerView={5}
                    spaceBetween={20}
                    breakpoints={{
                      640: {
                        slidesPerView: 5,
                      },
                      768: {
                        slidesPerView: 5,
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
              <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="19px">
                <Box as="img" src={iconExpensive.default} alt="" w="18px" h="18px" mr="8px" />
                <Text>{t('Home.expensive')}</Text>
              </Flex>
              <Stack direction="row" height="353px">
                <Swiper
                  scrollbar={{ draggable: true }}
                  spaceBetween={20}
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
          {cheapNftsData?.orders.length
            ? (
              <Flex width="100%" flexDirection="column" mt="40px">
                <Flex h="21px" width="100%" flexDirection="row" alignItems="center" mb="19px">
                  <Box as="img" src={IconCheapest.default} alt="" w="18px" h="18px" mr="8px" />
                  <Text>{t('Home.cheapest')}</Text>
                </Flex>
                <Stack direction="row" height="353px">
                  <Swiper
                    scrollbar={{ draggable: true }}
                    spaceBetween={20}
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
