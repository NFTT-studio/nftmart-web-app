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
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { takeOffer } from '../../../polkaSDK/api/takeOffer';
import { takeOrderOffer } from '../../../polkaSDK/api/takeOrderOffer';

import { useAppSelector } from '../../../hooks/redux';
import MyToast, { ToastBody } from '../../../components/MyToast';

interface Props {
  isShowDeal: boolean,
  setIsShowDeal: React.Dispatch<React.SetStateAction<boolean>>,
  offerId: string,
  offerOwner: string,
  orderId: string,
}

const DealDialog: FC<Props> = (({
  isShowDeal,
  setIsShowDeal,
  offerId,
  offerOwner,
  orderId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const history = useHistory();
  const onCancel = () => {
    setIsSubmitting(true);
    if (orderId) {
      takeOrderOffer({
        address: account!.address,
        offerId: Number(offerId),
        offerOwner,
        orderId,
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast(<ToastBody title="Error" message={t('common.error')} type="error" />);
              setIsShowDeal(false);
              setIsSubmitting(false);
            } else {
              toast(<ToastBody title="Success" message={t('common.success')} type="success" />);
              setTimeout(() => {
                setIsShowDeal(false);
                setIsSubmitting(false);
                history.push('/');
              }, 1500);
            }
          },
          error: (error) => {
            toast(<ToastBody title="Error" message={error} type="error" />);
            setIsShowDeal(false);
            setIsSubmitting(false);
          },
        },
      });
    } else {
      takeOffer({
        address: account!.address,
        offerId: Number(offerId),
        offerOwner,
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast(<ToastBody title="Error" message={t('common.error')} type="error" />);
              setIsShowDeal(false);
              setIsSubmitting(false);
            } else {
              toast(<ToastBody title="Success" message={t('common.success')} type="success" />);
              setTimeout(() => {
                setIsShowDeal(false);
                setIsSubmitting(false);
                history.push('/');
              }, 1500);
            }
          },
          error: (error) => {
            toast(<ToastBody title="Error" message={error} type="error" />);
            setIsShowDeal(false);
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
      onClose={() => setIsShowDeal(false)}
      isOpen={isShowDeal}
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
            {t('Detail.dealDesc')}
          </Text>
          <Flex w="100%" justifyContent="flex-end" pt="10px">
            <Button
              bg="#FFFFFF"
              color="#000000"
              border="1px #000000 solid"
              fontSize="14px"
              fontFamily="TTHoves-Medium, TTHoves"
              fontWeight="500"
              lineHeight="20px"
              borderRadius="4px"
              onClick={() => setIsShowDeal(false)}
              _hover={{
                background: '#000000 !important',
              }}
            >
              {t('common.no')}
            </Button>
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
