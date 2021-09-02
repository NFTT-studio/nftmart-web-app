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
} from '../../../assets/banner';

const Banner = ((
) => {
  const { t } = useTranslation();
  return (
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
