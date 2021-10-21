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
  InputRightElement,
} from '@chakra-ui/react';
import {
  useFormik,
} from 'formik';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-date-picker';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useQueryClient } from 'react-query';
import { submitOffer } from '../../../polkaSDK/api/submitOffer';
import { useAppSelector } from '../../../hooks/redux';
import useAccount from '../../../hooks/reactQuery/useAccount';
import MyToast, { ToastBody } from '../../../components/MyToast';
import useToken from '../../../hooks/reactQuery/useToken';
import {
  IconCalendar,
} from '../../../assets/images';
import {
  QUERY_KEYS,
} from '../../../constants';

interface Props {
  categoryId: string,
  classId: string,
  tokenId: string,
  isShowOffer: boolean,
  setIsShowOffer: React.Dispatch<React.SetStateAction<boolean>>,
}
const OfferDialog: FC<Props> = (({
  categoryId, classId, tokenId, isShowOffer, setIsShowOffer,
}) => {
  const queryCliet = useQueryClient();
  const chainState = useAppSelector((state) => state.chain);
  const history = useHistory();
  const { data: token } = useToken();
  const [value, onChange] = useState(new Date());
  const [expiration, onExpiration] = useState(0);

  const { account } = chainState;
  const { data } = useAccount(account!.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLDivElement>(null);
  const oneMonth = (60 * 60 * 24 * 30) / 6;

  const schema = Yup.object().shape({
    price: Yup.number().moreThan(0).required(t('Create.required')),
    during: Yup.number().moreThan(0).required(t('Create.required')),
  });

  const formik = useFormik({
    initialValues: {
      categoryId,
      classId,
      tokenId,
      quantity: 1,
      price: '',
      during: '',
    },
    onSubmit: (formValue, formAction) => {
      setIsSubmitting(true);
      submitOffer({
        address: account!.address,
        categoryId: Number(categoryId),
        classId: Number(classId),
        tokenId: Number(tokenId),
        quantity: 1,
        price: Number(formValue?.price),
        during: Number(formValue?.during),
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast(<ToastBody title="Error" message={t('common.error')} type="error" />);
            } else {
              toast(<ToastBody title="Success" message={t('common.success')} type="success" />);
              setTimeout(() => {
                setIsSubmitting(false);
                setIsShowOffer(false);
                queryCliet.refetchQueries(QUERY_KEYS.NFT);
              }, 2500);
            }
          },
          error: (error: string) => {
            toast(<ToastBody title="Error" message={error} type="error" />);
            setIsSubmitting(false);
            setIsShowOffer(false);
          },
        },
      });
    },
    validationSchema: schema,
  });

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setIsShowOffer(false)}
        isOpen={isShowOffer}
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
            <Flex p="30px" flexDirection="column">
              <Flex mb="34px" h="21px" alignItems="center" justifyContent="space-between">
                <Text>{t('Detail.makeAnOffer')}</Text>
                <AlertDialogCloseButton position="inherit" />
              </Flex>
              <Flex mb="13px" h="14px" alignItems="center" justifyContent="space-between">
                <Text
                  fontSize="12px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  {t('Detail.price')}
                </Text>
                <Text
                  fontSize="12px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  {t('Detail.balance')}
                  :
                  {' '}
                  {' '}
                  NMT
                </Text>
              </Flex>
              <InputGroup
                width="360px"
                height="40px"
                background="#FFFFFF"
                borderRadius="4px"
                border="1px solid #E5E5E5"
                mb="10px"
                _focus={{
                  boxShadow: 'none',

                }}
              >
                <Input
                  id="price"
                  name="price"
                  value={formik.values.price}
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
                  placeholder={t('SellSetting.price')}
                  _placeholder={{
                    color: '#999999',
                    fontSize: '12px',
                  }}
                />
                <InputRightAddon
                  width="72px"
                  height="40px"
                  background="#F4F4F4"
                  borderRadius="0px 4px 4px 0px"
                  border="1px solid #E5E5E5"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="14px"
                // eslint-disable-next-line react/no-children-prop
                  children="NMT"
                />
              </InputGroup>
              {formik.errors.price && formik.touched.price ? (
                <div style={{ color: 'red' }}>{formik.errors.price}</div>
              ) : null}
              { token?.price
                ? (
                  <Text
                    mb="23px"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                  >
                    ≈$
                    {formik.values.price * token?.price}
                  </Text>
                ) : null}
              <Text
                mb="13px"
                fontSize="12px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#000000"
              >
                {t('Detail.expiration')}
              </Text>
              <InputGroup
                width="360px"
                height="40px"
                background="#FFFFFF"
                borderRadius="4px"
                border="1px solid #E5E5E5"
                mb="10px"
                _focus={{
                  boxShadow: 'none',

                }}
              >
                <InputLeftAddon
                  height="40px"
                  background="#F4F4F4"
                  borderRadius="0px 4px 4px 0px"
                  border="1px solid #E5E5E5"
                  fontSize="14px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="14px"
                // eslint-disable-next-line react/no-children-prop
                  children={t('Detail.inAday')}
                />
                <Input
                  id="during"
                  name="during"
                  value={formik.values.during}
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
                  placeholder="Day"
                  _placeholder={{
                    color: '#999999',
                    fontSize: '12px',
                  }}
                />
                <InputRightAddon
                  // eslint-disable-next-line react/no-children-prop
                  children={(
                    <Image
                      w="22px"
                      h="22px"
                      borderStyle="dashed"
                      src={IconCalendar.default}
                    />
)}
                />

              </InputGroup>
              {formik.errors.during && formik.touched.during ? (
                <div style={{ color: 'red' }}>{formik.errors.during}</div>
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
              <Flex
                mt="10px"
                width="360px"
                flexFlow="wrap"
                justifyContent="flex-start"
                alignItems="center"
                background="#F8F8F9"
                borderRadius="2px"
                p="10px"
              >
                <Text
                  width="312px"
                  fontSize="12px"
                  fontFamily="PingFangSC-Regular, PingFang SC"
                  fontWeight="400"
                  color="#858999"
                >
                  {t('Detail.offerExplain')}
                </Text>
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
