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
  InputGroup,
  Input,
  InputRightAddon,
  InputLeftAddon,
  useToast,
} from '@chakra-ui/react';
import {
  useFormik,
} from 'formik';
import { useTranslation } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import { burnToken } from '../../../polkaSDK/api/burnToken';
import { useAppSelector } from '../../../hooks/redux';
import MyToast, { ToastBody } from '../../../components/MyToast';

interface Props {
  classId:number,
  tokenId:number,
  nftName:string,
  isShowDel: boolean,
  setIsShowDel: React.Dispatch<React.SetStateAction<boolean>>,
}
const OfferDialog: FC<Props> = (({
  classId, tokenId, nftName, isShowDel, setIsShowDel,
}) => {
  const toast = useToast();
  const chainState = useAppSelector((state) => state.chain);
  const history = useHistory();

  const { account } = chainState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLDivElement>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (formValue) => {
      if (formValue.name !== nftName) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="Error" message={t('create.error')} type="error" />
          ),
        });
        return;
      }
      setIsSubmitting(true);
      burnToken({
        classId: Number(classId),
        address: account!.address,
        tokenId: Number(tokenId),
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={t('create.error')} type="error" />
                ),
              });
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Success" message={t('common.success')} type="success" />
                ),
              });
              setTimeout(() => {
                setIsSubmitting(false);
                history.push('/account/owned');
              }, 2500);
            }
          },
          error: (error) => {
            setIsSubmitting(false);
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Error" message={error} type="error" />
              ),
            });
          },
        },
      });
    },
  });

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setIsShowDel(false)}
        isOpen={isShowDel}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent
          width="420px"
          background="#FFFFFF"
          borderRadius="4px"
          border="1px solid #E5E5E5"
        >
          <form onSubmit={formik.handleSubmit}>
            <Flex m="10px" h="21px" alignItems="center" justifyContent="flex-end">
              <AlertDialogCloseButton position="inherit" />
            </Flex>
            <Flex p="0px 30px 30px 30px" flexDirection="column">
              <Flex mb="13px" h="21px" alignItems="center" justifyContent="center">
                <Text
                  fontSize="18px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="bold"
                  color="#000000"
                >
                  {t('Update.burning')}
                </Text>
              </Flex>
              <Flex mb="13px" alignItems="center" justifyContent="center">
                <Text
                  display="inline-block"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  {t('Update.burningExplain')}
                  <Text
                    display="inline-block"
                    fontSize="16px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="bold"
                    color="red"
                  >
                    {nftName}
                  </Text>
                </Text>

              </Flex>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                fontSize="16px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                lineHeight="14px"
                color="#000000"
                _focus={{
                  boxShadow: 'none',
                  color: '#000000',
                  border: '1px solid #000000',
                }}
                _after={{
                  boxShadow: 'none',
                  color: '#000000',
                  border: '1px solid #000000',
                }}
                placeholder={t('Update.nftName')}
                _placeholder={{
                  color: '#999999',
                  fontSize: '12px',
                }}
              />

              {formik.errors.name && formik.touched.name ? (
                <div style={{ color: 'red' }}>{formik.errors.name}</div>
              ) : null}
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
                  type="submit"
                  _hover={{
                    background: '#000000 !important',
                  }}
                >
                  {t('Update.burningConfirm')}
                </Button>
              </Flex>

            </Flex>
          </form>
          <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
            <ModalOverlay />
          </Modal>
          <MyToast isCloseable />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
export default OfferDialog;
