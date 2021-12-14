import React, { FC } from 'react';
import {
  Flex,
  Image,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import MotionBox from '../MotionBox';

import {
  banner01,
  banner02,
  banner03,
  banner04,
  banner05,
  banner06,
  banner09,
  banner10,
  bannerLeft,
} from '../../../assets/banner';

const Banner = ((
) => {
  const { t } = useTranslation();
  const bannerImgLeft = [
    // {
    //   id: '0',
    //   icon: banner10.default,
    //   url: `/items/33-2-${encodeURIComponent('G1 1/1')}`,
    //   w: '205px',
    //   h: '205px',
    // },
  ];
  const bannerImgMiddle = [
    {
      id: '0',
      icon: banner09.default,
      url: '/items/54-2-The%20Face%20of%20Facebook%201%2F1',
      w: '410px',
      h: '615px',
    },
  ];
  const bannerImgRight = [
    {
      id: '0',
      icon: banner05.default,
      url: '/items/79-3-Room%20No.4%3A%20I%20Also%20Want%201%2F1',
      w: '205px',
      h: '410px',
    },
    {
      id: '1',
      icon: banner06.default,
      url: '/collection/22-Paper%20P',
      w: '205px',
      h: '215px',
    },
  ];
  const bannerBottom = [
    {
      id: '0',
      icon: banner01.default,
      url: '/items/33-4-Pull%20It%20Out%201%2F1',
      w: '205px',
      h: '205px',
    },
    {
      id: '1',
      icon: banner02.default,
      url: '/items/55-4-Twinborn%201%2F10',
      w: '205px',
      h: '205px',
    },
    {
      id: '2',
      icon: banner10.default,
      url: '/items/64-1-Crater%201%2F1',
      w: '205px',
      h: '205px',
    },
    {
      id: '3',
      icon: banner03.default,
      url: '/items/65-18-White%20House%20and%20Black%20House-The%20Stars%20in%201985%201%2F1',
      w: '410px',
      h: '205px',
    },
    {
      id: '3',
      icon: banner04.default,
      url: '/items/58-1-That%20Sea%202%2F60',
      w: '205px',
      h: '205px',
    },
  ];
  return (
    <Flex
      w="100vw"
      height="820px"
      background="#000000"
      justifyContent="center"
      mb="40px"
    >
      <Flex width="100%" maxWidth="1364px" position="relative" justifyContent="space-between">
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
              width="820px"
              height="615px"
            >
              <Flex
                width="205px"
                flexDirection="column"
                justifyContent="flex-end"
              >
                {bannerImgLeft.map((item) => (
                  <MotionBox
                    key={item.id}
                    backgroundColor="#000"
                    cursor="pointer"
                    _hover={{ boxShadow: 'lg' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      as={RouterLink}
                      to={item.url}
                    >
                      <Image
                        width={item.w}
                        height={item.h}
                        src={item.icon}
                      />
                    </Link>
                  </MotionBox>
                ))}
              </Flex>
              <Flex
                width="410px"
                flexDirection="column"
                justifyContent="flex-end"
              >
                {bannerImgMiddle.map((item) => (
                  <MotionBox
                    key={item.id}
                    backgroundColor="#000"
                    cursor="pointer"
                    _hover={{ boxShadow: 'lg' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      as={RouterLink}
                      to={item.url}
                    >
                      <Image
                        width={item.w}
                        height={item.h}
                        src={item.icon}
                      />
                    </Link>
                  </MotionBox>
                ))}
              </Flex>

              <Flex
                width="205px"
                flexDirection="column"
                justifyContent="flex-end"
              >
                {bannerImgRight.map((item) => (
                  <MotionBox
                    key={item.id}
                    backgroundColor="#000"
                    cursor="pointer"
                    _hover={{ boxShadow: 'lg' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      as={RouterLink}
                      to={item.url}
                    >
                      <Image
                        width={item.w}
                        height={item.h}
                        src={item.icon}
                      />
                    </Link>
                  </MotionBox>
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            {bannerBottom.map((item) => (
              <MotionBox
                key={item.id}
                backgroundColor="#000"
                cursor="pointer"
                _hover={{ boxShadow: 'lg' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  as={RouterLink}
                  to={item.url}
                >
                  <Image
                    width={item.w}
                    height={item.h}
                    src={item.icon}
                  />
                </Link>
              </MotionBox>
            ))}
          </Flex>
        </Flex>
        <Flex
          color="white"
          flexDirection="column"
          w="583px"
          alignItems="flex-start"
          justifyContent="flex-start"
          position="absolute"
          top="172px"
          left="100px"
          p={4}
        >
          {/* <Text
            fontSize="64px"
            fontFamily="TTHoves-Thin, TTHoves"
            fontWeight="100"
            color="#FFFFFF"
            lineHeight="75px"
          >
            {t('banner.titleOne')}
          </Text> */}
          <Text
            w="583px"
            fontFamily="TTHoves-Bold, TTHoves"
            fontWeight="bold"
            color="#FFFFFF"
            lineHeight="75px"
            letterSpacing="2px"
            fontSize="55px"
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
          <Link
            as={RouterLink}
            to="/browsing"
          >
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
          </Link>
        </Flex>
      </Flex>
    </Flex>

  );
});
export default Banner;
