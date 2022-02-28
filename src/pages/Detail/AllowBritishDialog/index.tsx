import React, { FC, useRef, useState } from 'react';
import {
  Flex,
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
  useToast,
} from '@chakra-ui/react';
import {
  useFormik,
} from 'formik';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { useQueryClient } from 'react-query';
import { priceStringDivUnit, formatNum } from '../../../utils/format';
import { bidDutchAuction } from '../../../polkaSDK/api/bidDutchAuction';
import { useAppSelector } from '../../../hooks/redux';
import useAccount from '../../../hooks/reactQuery/useAccount';
import MyToast, { ToastBody } from '../../../components/MyToast';
import useToken from '../../../hooks/reactQuery/useToken';

import {
  QUERY_KEYS,
} from '../../../constants';

interface Props {
  isShowBritish: boolean
  auctionId: string,
  setIsShowBritish: React.Dispatch<React.SetStateAction<boolean>>,
  moreThan: number,
  creatorId: string,
}
const OfferDialog: FC<Props> = (({
  isShowBritish, auctionId, setIsShowBritish, moreThan, creatorId,
}) => {
  const toast = useToast();
  const queryCliet = useQueryClient();
  const chainState = useAppSelector((state) => state.chain);
  const { data: token } = useToken();

  const { account } = chainState;
  const { data } = useAccount(account!.address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const cancelRef = useRef<HTMLDivElement>(null);

  const schema = Yup.object().shape({
    price: Yup.number().min(moreThan).required(t('Create.required')),
  });

  const formik = useFormik({
    initialValues: {
      price: moreThan,
    },
    onSubmit: (formValue, formAction) => {
      setIsSubmitting(true);
      bidDutchAuction({
        address: account!.address,
        auctionCreatorAddress: creatorId,
        auctionId: Number(auctionId),
        price: formValue?.price,
        cb: {
          success: (result) => {
            if (result.dispatchError) {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={result.dispatchError.toString()} type="error" />
                ),
              });
              setIsSubmitting(false);
              setIsShowBritish(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Success" message={t('common.success')} type="success" />
                ),
              });
              setTimeout(() => {
                setIsSubmitting(false);
                setIsShowBritish(false);
                queryCliet.refetchQueries(QUERY_KEYS.NFT);
              }, 2500);
            }
          },
          error: (error: string) => {
            if (error === 'Error: Cancelled') {
              setIsSubmitting(false);
              setIsShowBritish(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIsSubmitting(false);
            setIsShowBritish(false);
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
        onClose={() => setIsShowBritish(false)}
        isOpen={isShowBritish}
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
                <Text>{t('Detail.placeABid')}</Text>
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
                  {formatNum(priceStringDivUnit(data?.balance?.transferrable)) || 0}
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
                  placeholder={`${t('Detail.placeABidMust')}${formatNum(moreThan)}`}
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
              {token?.price ? (
                <Text
                  mb="23px"
                  fontSize="12px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                >
                  ≈$
                  {formatNum((formik.values.price * token?.price))}
                </Text>
              )
                : null}

              {formik.errors.price && formik.touched.price ? (
                <div style={{ color: 'red' }}>{formik.errors.price}</div>
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
                  isDisabled={Number(priceStringDivUnit(data?.balance?.transferrable)) < Number(moreThan)}
                  _hover={{
                    background: '#000000 !important',
                  }}
                >
                  {t('Detail.placeBid')}
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
                  {t('Detail.placeABidExplain')}
                  {t('Detail.placeABidExplainTwo')}
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
