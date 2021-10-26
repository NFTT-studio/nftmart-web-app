/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import React, { FC, useState } from 'react';
import {
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Image,
  Box,
  Flex,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import {
  IconDetailshaSre,
  SharelLnk,
  ShareTwitter,
  ShareFacebook,
} from '../../assets/images';

type ShareWebProps = {
}

const ShareWeb: FC<ShareWebProps> = () => {
  const [opening, setOpening] = useState(false);
  const url = window.location.href;
  const { onCopy } = useClipboard(url);
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const handleSelect = () => {
    toast({
      title: 'success',
      status: 'success',
      position: 'top',
      duration: 3000,
      description: t('header.success'),
    });
    onCopy();
    setOpening(false);
  };
  const shareSelect = () => {
    onCopy();
    setOpening(false);
  };

  return (
    <Popover
      placement="bottom"
      size="sm"
      variant="menu"
      isOpen={opening}
      onOpen={() => setOpening(true)}
      onClose={() => setOpening(false)}
    >
      <PopoverTrigger>
        <Box
          cursor="pointer"
          ml="28px"
          width="32px"
          height="32px"
          borderRadius="50%"
          border="1px solid #E5E5E5"
          display="flex"
          justifyContent="center"
          alignItems="center"
          _hover={{
            boxShadow: '0px 2px 8px 0px #E1E1E1',
          }}
        >
          <Image
            w="22px"
            h="22px"
            src={IconDetailshaSre.default}
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent width="152px" _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverBody p="0" display="flex" flexDirection="column" justifyContent="center">
          <Flex
            width="100%"
            height="48px"
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#858999"
            lineHeight="20px"
            p="13px 20px"
            _hover={{ background: '#F9F9F9' }}
            onClick={() => {
              handleSelect();
            }}
          >
            <Image
              mr="10px"
              w="22px"
              h="22px"
              src={SharelLnk.default}
            />
            Copy Link
          </Flex>
          <TwitterShareButton
            url={i18n.language === 'zh' ? `@NFTMartio 查看 ${url}`
              : `Check out this NFT on NFTMart ${url} via @NFTMartio`}
            title=""
            className="shareBtn col-md-1 col-sm-1 col-xs-1"
          >
            <Flex
              width="100%"
              height="48px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#858999"
              lineHeight="20px"
              p="13px 20px"
              _hover={{ background: '#F9F9F9' }}
              onClick={() => {
                shareSelect();
              }}
            >
              <Image
                mr="10px"
                w="22px"
                h="22px"
                src={ShareTwitter.default}
              />
              Twitter
            </Flex>
          </TwitterShareButton>
          <FacebookShareButton
            url={url}
            title="NFTMart"
            className="shareBtn col-md-1 col-sm-1 col-xs-1"
          >
            <Flex
              width="100%"
              height="48px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#858999"
              lineHeight="20px"
              p="13px 20px"
              _hover={{ background: '#F9F9F9' }}
              onClick={() => {
                shareSelect();
              }}
            >
              <Image
                mr="10px"
                w="22px"
                h="22px"
                src={ShareFacebook.default}
              />
              Facebook
            </Flex>
          </FacebookShareButton>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareWeb;
