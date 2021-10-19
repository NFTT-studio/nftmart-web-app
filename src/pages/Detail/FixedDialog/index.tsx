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
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { bidBritishAuction } from '../../../polkaSDK/api/bidBritishAuction';
import { useAppSelector } from '../../../hooks/redux';
import useAccount from '../../../hooks/reactQuery/useAccount';
import MyToast, { ToastBody } from '../../../components/MyToast';
import useToken from '../../../hooks/reactQuery/useToken';
import { priceStringDivUnit } from '../../../utils/format';

import {
  QUERY_KEYS,
} from '../../../constants';

interface Props {
  price: string,
  nftName: string,
  collectionName: string | undefined,
  logoUrl: string,
  ownerId: string,
  orderId: string,
  isShowFixed: boolean,
  setIsShowFixed: React.Dispatch<React.SetStateAction<boolean>>,
  creatorId: string,
  auctionId: string,
}
const BuyDialog: FC<Props> = (({
  price, nftName, collectionName, logoUrl, isShowFixed, setIsShowFixed, creatorId, auctionId,
}) => {
  const chainState = useAppSelector((state) => state.chain);
  const history = useHistory();
  const { data: token } = useToken();
  const queryCliet = useQueryClient();

  const { account } = chainState;
  const { data } = useAccount(account!.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLDivElement>(null);
  const prices = priceStringDivUnit(price);

  const onSubmit = () => {
    setIsSubmitting(true);
    bidBritishAuction({
      address: account!.address,
      auctionCreatorAddress: creatorId,
      auctionId: Number(auctionId),
      prices,
      cb: {
        success: (result) => {
          if (result.dispatchError) {
            toast(<ToastBody title="Error" message={t('common.error')} type="error" />);
          } else {
            toast(<ToastBody title="Success" message={t('common.success')} type="success" />);
            setTimeout(() => {
              setIsSubmitting(false);
              setIsShowFixed(false);
              queryCliet.refetchQueries(QUERY_KEYS.NFT);
            }, 2500);
          }
        },
        error: (error: string) => {
          toast(<ToastBody title="Error" message={error} type="error" />);
          setIsSubmitting(false);
          setIsShowFixed(false);
        },
      },
    });
  };

  return (

    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setIsShowFixed(false)}
        isOpen={isShowFixed}
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
              <Text>{t('Detail.checkout')}</Text>
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
                {t('Detail.subtotal')}
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
                  width="auto"
                  height="40px"
                  borderRadius="4px"
                  src={logoUrl}
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
                  {prices}
                  {' '}
                  <Text color="#999999">
                    NMT
                  </Text>
                </Text>
                <Text>
                  {token?.price
                    ? `(≈$
                      ${Number(prices) * Number(token?.price)}
                      )` : null}
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
                  {t('Detail.total')}
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
                  {prices}
                  {' '}
                  <Text color="#999999">
                    NMT
                  </Text>
                </Text>
                <Text>
                  {token?.price
                    ? `(≈$
                      ${Number(prices) * Number(token?.price)}
                      )` : null}
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
              {t('Detail.Transferrable')}
              :
              {' '}
              {priceStringDivUnit(data?.balance?.transferrable)}
              {' '}
              NMT
            </Text>
            <Flex w="100%" justifyContent="center" pt="10px">
              <Button
                isLoading={isSubmitting}
                bg="#000000"
                color="#FFFFFF"
                fontSize="14px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                lineHeight="20px"
                borderRadius="4px"
                onClick={onSubmit}
                isDisabled={Number(priceStringDivUnit(data?.balance?.transferrable)) < Number(prices)}
                _hover={{
                  background: '#000000 !important',
                }}
              >
                {t('Detail.checkoutSub')}
              </Button>
            </Flex>
          </Flex>
          <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
            <ModalOverlay />
          </Modal>
          <MyToast isCloseable />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
export default BuyDialog;
