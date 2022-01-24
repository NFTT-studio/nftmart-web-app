import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Flex, Text, Link, useMediaQuery,
} from '@chakra-ui/react';
import {
  GithubLogo,
  GithubLogoHover,
  TwitterLogo,
  MediumLogo,
  TwitterLogoHover,
  MediumLogoHover,
  TelegramLogo,
  TelegramLogoHover,
  Url,
  UrlHover,
} from '../../assets/images';

const ICONS = [
  { icon: Url, hover: UrlHover },
  { icon: MediumLogo, hover: MediumLogoHover },
  { icon: TwitterLogo, hover: TwitterLogoHover },
  { icon: TelegramLogo, hover: TelegramLogoHover },
  { icon: GithubLogo, hover: GithubLogoHover },
];

const links = [
  'https://www.nftmart.io/',
  'https://nftmart-io.medium.com/',
  'https://twitter.com/NFTMart',
  'https://t.me/NFTMartOfficial',
  'https://github.com/NFTT-studio',
];

const ICON_LIST = ICONS.map((title, index) => ({
  src: ICONS[index].icon,
  hoverSrc: ICONS[index].hover,
  id: index,
  link: links[index],
}));

export default function Footer() {
  const [isLargerThan700] = useMediaQuery('(min-width: 700px)');
  const iconList = ICON_LIST;
  const { t } = useTranslation();
  return (
    <>
      {isLargerThan700
        ? (
          <Box
            as="footer"
            width="100vw"
            display="flex"
            justifyContent="center"
            minHeight="92px"
            backgroundColor="#191A24"
            border="1px solid #979797"
            className="page-footer"
          >
            <Flex
              p="0"
              maxWidth="1364px"
              w="100%"
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="#191A24"
            >
              <Box maxW="80%" minW="40%" display="flex" flexFlow="row" mr="20px">
                <Text lineHeight="20px" fontWeight="500" fontSize="14px" color="#999" mr="15px">
                  © 2021 NFTMart
                </Text>
                <Text color="#FFF" fontSize="14px">
                  <Link
                    target="blank"
                    href="https://docs.google.com/forms/d/1WCNeiufW1XxLsyme7dJUys7y7t-XJRyp1nQR0bhnvVQ"
                  >
                    Artist Invites
                  </Link>
                  {' '}
                  |
                  {' '}
                  <Link
                    target="blank"
                    href="https://www.gate.io/en/trade/NMT_USDT"
                  >
                    Buy NMT
                  </Link>
                </Text>
              </Box>
              <Box maxW="50%" minW="20%">
                <Box display="flex" ml="0px">
                  {iconList.map(({
                    id, src, hoverSrc, link,
                  }) => (
                    <Link
                      target="blank"
                      key={id}
                      href={link}
                    >
                      <Box
                        ml={id !== 0 ? '30px' : 0}
                        role="group"
                        key={src.default}
                      >
                        <Box
                          as="img"
                          alt=""
                          src={src.default}
                          width="32px"
                          cursor="pointer"
                          _groupHover={{ display: 'none' }}
                        />
                        <Box
                          as="img"
                          alt=""
                          display="none"
                          src={hoverSrc.default}
                          width="32px"
                          cursor="pointer"
                          _groupHover={{ display: 'block' }}
                        />
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Box>
            </Flex>
          </Box>
        ) : (
          <Box
            as="footer"
            width="100vw"
            display="flex"
            justifyContent="center"
            h="125px"
            backgroundColor="#191A24"
            border="1px solid #979797"
            className="page-footer"
          >
            <Flex
              p="0"
              w="100%"
              h="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              backgroundColor="#191A24"
            >
              <Text
                lineHeight="20px"
                fontWeight="500"
                fontSize="10.5px"
                color="#999"
              >
                © 2021 NFTMart
              </Text>
              <Box
                mt="15px"
                color="#FFF"
                fontSize="10.5px"
              >
                <Link
                  target="blank"
                  href="https://docs.google.com/forms/d/1WCNeiufW1XxLsyme7dJUys7y7t-XJRyp1nQR0bhnvVQ"
                >
                  Artist Invites
                </Link>
                {' '}
                |
                {' '}
                <Link
                  target="blank"
                  href="https://www.gate.io/en/trade/NMT_USDT"
                >
                  Buy NMT
                </Link>
              </Box>
              <Box mt="15px">
                <Box display="flex">
                  {iconList.map(({
                    id, src, hoverSrc, link,
                  }) => (
                    <Link
                      target="blank"
                      key={id}
                      href={link}
                    >
                      <Box
                        ml={id !== 0 ? '30px' : 0}
                        role="group"
                        key={src.default}
                      >
                        <Box
                          as="img"
                          alt=""
                          src={src.default}
                          width="18px"
                          cursor="pointer"
                          _groupHover={{ display: 'none' }}
                        />
                        <Box
                          as="img"
                          alt=""
                          display="none"
                          src={hoverSrc.default}
                          width="18px"
                          cursor="pointer"
                          _groupHover={{ display: 'block' }}
                        />
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Box>
            </Flex>
          </Box>
        )}
    </>
  );
}
