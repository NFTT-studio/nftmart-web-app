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
import { destroyClass } from '../../../polkaSDK/api/destroyClass';
import { useAppSelector } from '../../../hooks/redux';
import MyToast, { ToastBody } from '../../../components/MyToast';

interface Props {
  classId:number,
  ownerId:string,
  collectionName:string,
  isShowDel: boolean,
  setIsShowDel: React.Dispatch<React.SetStateAction<boolean>>,
}
const OfferDialog: FC<Props> = (({
  classId, ownerId, collectionName, isShowDel, setIsShowDel,
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
      if (formValue.name !== collectionName) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="Error" message={t('create.error')} type="error" />
          ),
        });
        return;
      }
      setIsSubmitting(true);
      destroyClass({
        classId: Number(classId),
        address: account!.address,
        ownerId,
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
                history.push('/account/collections');
              }, 2500);
            }
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
                  {t('Detail.makeAnOffer')}
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
                  The delete operation cannot be undone and cannot be restored. Please check again whether it is really going to be deleted.
                  If you are sure, please enter the name of the collection below:
                  <Text
                    display="inline-block"
                    fontSize="16px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="bold"
                    color="red"
                  >
                    {collectionName}
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
                placeholder={t('SellSetting.name')}
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
                  {t('Detail.makeOffer')}
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
