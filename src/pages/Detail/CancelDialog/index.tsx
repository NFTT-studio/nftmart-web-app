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
import { useQueryClient } from 'react-query';

import { deleteOrder } from '../../../polkaSDK/api/deleteOrder';
import { useAppSelector } from '../../../hooks/redux';
import MyToast, { ToastBody } from '../../../components/MyToast';
import {
  QUERY_KEYS,
} from '../../../constants';

interface Props {
  isShowCancel: boolean,
  setIsShowCancel: React.Dispatch<React.SetStateAction<boolean>>,
  orderId: string,
  nftId: string,
}

const CancelDialog: FC<Props> = (({
  isShowCancel,
  setIsShowCancel,
  orderId,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const queryCliet = useQueryClient();
  const history = useHistory();
  const onCancel = () => {
    setIsSubmitting(true);
    deleteOrder({
      address: account!.address,
      orderId,
      cb: {
        success: () => {
          toast({
            position: 'top',
            render: () => (
              <ToastBody title="Success" message={t('common.success')} type="success" />
            ),
          });
          setTimeout(() => {
            setIsShowCancel(false);
            setIsSubmitting(false);
            queryCliet.refetchQueries(QUERY_KEYS.NFT);
          }, 3000);
        },
        error: (error) => {
          toast({
            position: 'top',
            render: () => (
              <ToastBody title="Error" message={error} type="error" />
            ),
          });
          setIsSubmitting(false);
        },
      },
    });
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => setIsShowCancel(false)}
      isOpen={isShowCancel}
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
            <Text>{t('Detail.cancel')}</Text>
            <AlertDialogCloseButton position="inherit" />
          </Flex>
          <Text
            fontSize="14px"
            fontFamily="TTHoves-Regular, TTHoves"
            fontWeight="400"
            color="#999999"
          >
            {t('Detail.cancelDesc')}
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
              onClick={() => setIsShowCancel(false)}
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

export default CancelDialog;
