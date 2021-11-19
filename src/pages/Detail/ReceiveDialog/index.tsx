import React, { FC, useRef, useState } from 'react';
import {
  Flex,
  Text,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  Modal,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { takeOffer } from '../../../polkaSDK/api/takeOffer';
import { redeemBritishAuction } from '../../../polkaSDK/api/redeemBritishAuction';
import { redeemDutchAuction } from '../../../polkaSDK/api/redeemDutchAuction';

import { useAppSelector } from '../../../hooks/redux';
import MyToast, { ToastBody } from '../../../components/MyToast';

interface Props {
  isShowReceive: boolean,
  setIshowReceive: React.Dispatch<React.SetStateAction<boolean>>,
  auctionId: string,
  creatorId: string,
  type: string,
}

const DealDialog: FC<Props> = (({
  isShowReceive,
  setIshowReceive,
  auctionId,
  creatorId,
  type,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const history = useHistory();
  const onCancel = () => {
    setIsSubmitting(true);
    if (type === 'British') {
      redeemBritishAuction({
        address: account!.address,
        auctionId: Number(auctionId),
        auctionCreatorAddress: creatorId,
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={result.dispatchError.toString()} type="error" />
                ),
              });
              setIshowReceive(false);
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Success" message={t('common.success')} type="success" />
                ),
              });
              setTimeout(() => {
                setIshowReceive(false);
                setIsSubmitting(false);
                history.push('/account/owned');
              }, 2500);
            }
          },
          error: (error: string) => {
            if (error === 'Error: Cancelled') {
              setIshowReceive(false);
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIshowReceive(false);
            setIsSubmitting(false);
          },
        },
      });
    }
    if (type === 'Dutch') {
      redeemDutchAuction({
        address: account!.address,
        auctionId: Number(auctionId),
        auctionCreatorAddress: creatorId,
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={result.dispatchError.toString()} type="error" />
                ),
              });
              setIshowReceive(false);
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Success" message={t('common.success')} type="success" />
                ),
              });
              setTimeout(() => {
                setIshowReceive(false);
                setIsSubmitting(false);
                history.push('/');
              }, 1500);
            }
          },
          error: (error) => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Error" message={error} type="error" />
              ),
            });
            setIshowReceive(false);
            setIsSubmitting(false);
          },
        },
      });
    }
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => setIshowReceive(false)}
      isOpen={isShowReceive}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        width="420px"
        height="183px"
        background="#FFFFFF"
        borderRadius="4px"
        border="1px solid #E5E5E5"
      >
        <Flex p="30px" flexDirection="column">
          <Flex mb="35px" h="21px" alignItems="center" justifyContent="space-between">
            <Text>{t('Detail.deal')}</Text>
            <AlertDialogCloseButton position="inherit" />
          </Flex>
          <Text
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#999999"
          >
            {t('Detail.dealReceive')}
          </Text>
          <Flex w="100%" justifyContent="flex-end" pt="10px">
            <Button
              isLoading={isSubmitting}
              bg="#000000"
              color="#FFFFFF"
              fontSize="14px"
              fontFamily="TTHoves-Medium, TTHoves"
              fontWeight="500"
              lineHeight="20px"
              borderRadius="4px"
              onClick={onCancel}
              ml="20px"
              _hover={{
                background: '#000000 !important',
              }}
            >
              {t('common.yes')}
            </Button>
          </Flex>
        </Flex>
      </AlertDialogContent>
      <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
        <ModalOverlay />
      </Modal>
      <MyToast isCloseable />
    </AlertDialog>
  );
});

export default DealDialog;
