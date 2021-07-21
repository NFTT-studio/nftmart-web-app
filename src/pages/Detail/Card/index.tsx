import React, { FC, useRef, useState } from 'react';
import {
  Flex,
  Image,
  Text,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { takeOrder } from '../../../polkaSDK/api/takeOrder';
import { useAppSelector } from '../../../hooks/redux';

interface Props {
  price: string,
  nftName: string,
  collectionName: string,
  logoUrl: string,
  ownerId: string,
  orderId: string
}
const CreateCard: FC<Props> = (({
  price, nftName, collectionName, logoUrl, orderId, ownerId,
}) => {
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;

  const { t } = useTranslation();
  const cancelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onSubmit = () => {
    takeOrder({
      address: account?.address,
      orderId,
      orderOwner: ownerId,
      cb: {
        success: () => {
          alert('success');
        },
        error: (error: string) => {
          alert('error');
        },
      },
    });
  };

  return (

    <>
      <Button
        ml="40px"
        width="109px"
        height="35px"
        background="#FFFFFF"
        borderRadius="4px"
        border="1px solid #3D00FF"
        fontSize="14px"
        fontFamily="TTHoves-Regular, TTHoves"
        fontWeight="400"
        color="#3D00FF"
        onClick={() => setIsOpen(true)}
      >
        {t('Detail.BuyNow')}
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent
          width="420px"
          height="352px"
          background="#FFFFFF"
          borderRadius="4px"
          border="1px solid #E5E5E5"
        >

          <Flex p="30px" flexDirection="column">
            <Flex mb="35px" h="21px" alignItems="center" justifyContent="space-between">
              <Text>{t('Detail.Checkout')}</Text>
              <AlertDialogCloseButton position="inherit" />
            </Flex>
            <Flex h="25px" justifyContent="space-between" alignItems="flex-start" borderBottom="1px solid #E5E5E5">
              <Text
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
              >
                {t('Detail.Item')}
              </Text>
              <Text
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
              >
                {t('Detail.Subtotal')}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" borderBottom="1px solid #E5E5E5" p="16px 0">
              <Flex
                flexDirection="row"
                justifyContent="flex-start"
                width="224px"
                textAlign="left"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
                lineHeight="20px"
              >
                <Image
                  mr="10px"
                  width="54px"
                  height="40px"
                  borderRadius="4px"
                  src={logoUrl}
                  alt=""
                />
                <Flex
                  flexDirection="column"
                  textAlign="left"
                  fontSize="12px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="14px"
                >
                  <Text
                    mb="5px"
                    width="60px"
                    fontSize="14px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#000000"
                    lineHeight="20px"
                  >
                    {nftName}
                  </Text>
                  <Text>
                    {collectionName}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                flexDirection="column"
                textAlign="left"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="14px"
              >
                <Text
                  display="flex"
                  flexFlow="row"
                  justifyContent="flex-end"
                  mb="5px"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                  lineHeight="20px"
                >
                  {price}
                  <Text color="#999999">
                    NMT
                  </Text>
                </Text>
                <Text>
                  (≈$1,146.90)
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" pt="12px">
              <Flex
                flexDirection="column"
                textAlign="left"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="14px"
              >
                <Text
                  display="flex"
                  flexFlow="row"
                  justifyContent="flex-end"
                  mb="5px"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="20px"
                >
                  {t('Detail.Total')}
                </Text>
                <Text />
              </Flex>
              <Flex
                flexDirection="column"
                textAlign="left"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="14px"
              >
                <Text
                  display="flex"
                  flexFlow="row"
                  justifyContent="flex-end"
                  mb="5px"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#000000"
                  lineHeight="20px"
                >
                  {price}
                  <Text color="#999999">
                    NMT
                  </Text>
                </Text>
                <Text>
                  (≈$1,146.90)
                </Text>
              </Flex>
            </Flex>
            <Text
              pt="23px"
              w="100%"
              textAlign="center"
              fontSize="12px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#999999"
              lineHeight="20px"
            >
              {t('Detail.Balance')}
              : 2,023,482 NMT
            </Text>
            <Flex w="100%" justifyContent="center" pt="10px">
              <Button
                bg="#000000"
                color="#FFFFFF"
                fontSize="14px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                lineHeight="20px"
                borderRadius="4px"
                onClick={onSubmit}
              >
                {t('Detail.CheckoutSub')}
              </Button>
            </Flex>
          </Flex>

        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
export default CreateCard;
