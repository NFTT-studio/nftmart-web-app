/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable react/no-children-prop */
import React, { useState, MouseEventHandler } from 'react';
import {
  useFormik,
} from 'formik';
import {
  Flex,
  Container,
  Text,
  Image,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputGroup,
  Link,
  Input,
  InputRightAddon,
  RadioGroup,
  Radio,
  Stack,
  Modal,
  ModalOverlay,
  Switch,
  Progress,
  useToast,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import {
  useHistory, RouteComponentProps, Link as RouterLink,
} from 'react-router-dom';
import date from 'date-and-time';
import { useTranslation } from 'react-i18next';

import { boolean } from 'yup/lib/locale';
import MainContainer from '../../layout/MainContainer';
import colors from '../../themes/colors';
import useNft from '../../hooks/reactQuery/useNft';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import LoginDetector from '../../components/LoginDetector';
import { getTax } from '../../polkaSDK/api/getTax';
import { NumberToString } from '../../utils/format';

import {
  IconSummary,
  IconIntructions,
  IconLeft,
} from '../../assets/images';
import {
  PINATA_SERVER,
} from '../../constants';
import { useAppSelector } from '../../hooks/redux';
import { createOrder } from '../../polkaSDK/api/createOrder';
import { settingOrder } from '../../polkaSDK/api/settingOrder';
import { submitDutchAuction } from '../../polkaSDK/api/submitDutchAuction';
import { submitBritishAuction } from '../../polkaSDK/api/submitBritishAuction';
import MyToast, { ToastBody } from '../../components/MyToast';

const SellSetting = ({ match }: RouteComponentProps<{ nftId: string }>) => {
  const { i18n, t } = useTranslation();
  const toast = useToast();
  const [tax, setTax] = useState(0);
  getTax().then((res) => {
    setTax(Number(res.toString()));
  });
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const history = useHistory();

  const [selectId, setSelectId] = useState(0);
  const { nftId } = match.params;
  const collectionsId = nftId.split('-')[0];

  const { data: nftData } = useNft(nftId);
  const { data: collectionsData } = useCollectionsSinger(collectionsId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnToEnglishAuction, setTurnToEnglishAuction] = useState(false);
  const [automaticDelay, setAutomaticDelay] = useState(false);
  const [fixedPriceSl, setFixedPriceSl] = useState(false);
  const [commissionRateSl, setcommissionRateSl] = useState(false);

  const orderId = nftData?.nftInfo?.sale_id;
  const type = nftData?.nftInfo?.auction?.type || false;

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectId(Number(event.currentTarget.id));
  };

  const schema = Yup.object().shape({
    price: Yup.number().moreThan(0).required(t('Create.required')),
    deposits: Yup.number().min(1, `${t('common.pledgeRule')}1`).required(t('Create.required')),
  });
  const schemaDutch = Yup.object().shape({
    startingPrice: Yup.number().moreThan(0).required(t('Create.required')),
    endingPrice: Yup.number().moreThan(0).required(t('Create.required')),
    expirationDate: Yup.string().required(t('Create.required')),
    minimumMarkup: Yup.number().moreThan(0, t('SellSetting.minimumMarkupRule')).required(t('Create.required')),
    automaticDelay: Yup.boolean().required(t('Create.required')),
    dutchDeposits: Yup.number().min(1, `${t('common.pledgeRule')}1`).required(t('Create.required')),
  });
  const schemaEnglish = Yup.object().shape({
    startingPrice: Yup.number().moreThan(0).required(t('Create.required')),
    expirationDate: Yup.string().required(t('Create.required')),
    minimumMarkup: Yup.number().moreThan(0, t('SellSetting.minimumMarkupRule')).required(t('Create.required')),
    automaticDelay: Yup.boolean().required(t('Create.required')),
    englishDeposits: Yup.number().min(1, `${t('common.pledgeRule')}1`).required(t('Create.required')),
  });
  function number2PerU16(x) {
    return (x / 65535.0) * 100;
  }
  const actionTime = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    const mm = `'${month}'`;
    const dd = `'${day}'`;
    const minutess = `'${minutes}'`;
    if (mm.length === 3) {
      month = `0${month}`;
    }
    if (dd.length === 3) {
      day = `0${day}`;
    }
    if (minutess.length === 3) {
      minutes = `0${minutes}`;
    }
    const time = `${year}-${month}-${day} ${hours}:${minutes}`;
    return time;
  };
  const ButtonArr = [
    {
      id: 0,
      title: t('SellSetting.setPrice'),
      subtitle: t('SellSetting.sellAtaFixedPrice'),
      isDisabled: false,
    },
    {
      id: 1,
      title: t('SellSetting.dutchAuction'),
      subtitle: t('SellSetting.sellAtaDecliningPrice'),
      isDisabled: !!(selectId === 0 && Number(nftData?.nftInfo?.price) > 0 && !type),
    },
    {
      id: 2,
      title: t('SellSetting.englishAuction'),
      subtitle: t('SellSetting.auctionToTheHighestBidder'),
      isDisabled: !!(selectId === 0 && Number(nftData?.nftInfo?.price) > 0 && !type),
    },
  ];
  const formik = useFormik({
    initialValues: {
      price: Number(nftData?.nftInfo?.price) > 0 ? NumberToString(nftData?.nftInfo?.price) : '',
      deposits: selectId === 0 && Number(nftData?.nftInfo?.price) > 0 ? NumberToString(nftData?.nftInfo?.pledge) : '',
      dutchDeposits: '',
      englishDeposits: '',
      startingPrice: '',
      endingPrice: '',
      expirationDate: '',
      minimumMarkup: 1,
      automaticDelay: false,
      turnToEnglishAuction: false,
      fixedPriceSl: false,
      commissionRate: 0,
      fixedPrice: '',
    },
    onSubmit: (formValue, formAction) => {
      setIsSubmitting(true);
      const orderParams = {
        address: account!.address,
        price: formValue.price,
        deposits: formValue.deposits,
        classId: nftData?.nftInfo.class_id,
        quantity: nftData?.nftInfo.quantity,
        tokenId: nftData?.nftInfo.token_id,
        commissionRate: formValue.commissionRate / 100,
        cb: {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            setTimeout(() => {
              setIsSubmitting(false);
              formAction.resetForm();
              history.push(`/items/${nftData?.nftInfo?.id}-${encodeURIComponent(nftData?.nftInfo?.metadata?.name)}`);
            }, 3000);
          },
          error: (error) => {
            if (error === 'Error: Cancelled') {
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIsSubmitting(false);
          },
        },
      };
      const settingOrderParams = {
        address: account!.address,
        orderId,
        categoryId: formValue.categoryId,
        price: formValue.price,
        deposits: formValue.deposits,
        classId: nftData?.nftInfo.class_id,
        quantity: nftData?.nftInfo.quantity,
        tokenId: nftData?.nftInfo.token_id,
        commissionRate: formValue.commissionRate / 100,
        cb: {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            setTimeout(() => {
              setIsSubmitting(false);
              formAction.resetForm();
              history.push(`/items/${nftData?.nftInfo?.id}-${encodeURIComponent(nftData?.nftInfo?.metadata?.name)}`);
            }, 3000);
          },
          error: (error) => {
            if (error === 'Error: Cancelled') {
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIsSubmitting(false);
          },
        },
      };
      const dutchParams = {
        address: account!.address,
        maxPrice: formValue.startingPrice,
        minPrice: formValue.endingPrice,
        expirationDate: formValue.expirationDate,
        allow_british_auction: formValue.turnToEnglishAuction,
        range: Number(formValue.minimumMarkup) / 100,
        tokens: [[nftData?.nftInfo.class_id, nftData?.nftInfo.token_id, 1]],
        commissionRate: formValue.commissionRate / 100,
        dutchDeposits: formValue.dutchDeposits,
        cb: {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            setIsSubmitting(false);
            formAction.resetForm();
            setTimeout(() => {
              history.push(`/items/${nftData?.nftInfo?.id}-${encodeURIComponent(nftData?.nftInfo?.metadata?.name)}`);
            }, 3000);
          },
          error: (error) => {
            if (error === 'Error: Cancelled') {
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIsSubmitting(false);
          },
        },
      };
      const britishParams = {
        address: account!.address,
        InitPrice: formValue.startingPrice,
        hammerPrice: Number(formValue.fixedPrice),
        expirationDate: formValue.expirationDate,
        allow_british_auction: formValue.automaticDelay,
        range: Number(formValue.minimumMarkup) / 100,
        tokens: [[nftData?.nftInfo.class_id, nftData?.nftInfo.token_id, 1]],
        commissionRate: formValue.commissionRate / 100,
        englishDeposits: formValue.englishDeposits,
        cb: {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            setTimeout(() => {
              setIsSubmitting(false);
              formAction.resetForm();
              history.push(`/items/${nftData?.nftInfo?.id}-${encodeURIComponent(nftData?.nftInfo?.metadata?.name)}`);
            }, 3000);
          },
          error: (error) => {
            if (error === 'Error: Cancelled') {
              setIsSubmitting(false);
            } else {
              toast({
                position: 'top',
                render: () => (
                  <ToastBody title="Error" message={error} type="error" />
                ),
              });
            }
            setIsSubmitting(false);
          },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (selectId === 0 && Number(nftData?.nftInfo?.price) > 0) {
        settingOrder(settingOrderParams as any);
      }
      if (selectId === 0 && !(Number(nftData?.nftInfo?.price) > 0)) {
        createOrder(orderParams as any);
      }
      if (selectId === 1) {
        if (Number(formValue.startingPrice) < Number(formValue.endingPrice)) {
          toast({
            position: 'top',
            render: () => (
              <ToastBody title="Error" message={t('SellSetting.dutchRule')} type="error" />
            ),
          });
          setIsSubmitting(false);
          return;
        }
        submitDutchAuction(dutchParams as any);
      }
      if (selectId === 2) {
        submitBritishAuction(britishParams as any);
      }
    },
    // eslint-disable-next-line no-nested-ternary
    validationSchema: Number(selectId) === 0 ? schema : Number(selectId) === 1 ? schemaDutch : schemaEnglish,
  });

  return (
    <MainContainer title={`${t('SellSetting.title')}-${nftData?.nftInfo?.metadata?.name}-${collectionsData?.collection?.metadata?.name}|${t('Home.title')}`}>
      <Flex
        w="100vw"
        h="80px"
        background="#F9F9F9"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >

        <Flex
          maxWidth="1364px"
          w="100VW"
          height="40px"
          flexDirection="row"
          justifyContent="felx-start"
          alignItems="center"
        >
          <Link
            as={RouterLink}
            to={`/items/${nftData?.nftInfo?.id}-${nftData?.nftInfo?.metadata?.name}`}
          >
            <Flex
              height="40px"
              flexDirection="row"
              justifyContent="felx-start"
              alignItems="center"
            >
              <Image
                mr="20px"
                w="12px"
                h="12px"
                src={IconLeft.default}
              />

              <Image
                m="0 20px 0 10px"
                w="auto"
                h="40px"
                src={`${PINATA_SERVER}nft/${nftData?.nftInfo?.metadata?.previewUrl || nftData?.nftInfo?.metadata?.logoUrl}`}
              />
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Text
                  fontSize="12px"
                  fontFamily="TTHoves-Regular, TTHoves"
                  fontWeight="400"
                  color="#999999"
                  lineHeight="14px"
                >
                  {collectionsData?.collection?.metadata?.name || ''}
                </Text>
                <Text
                  mt="5px"
                  fontSize="14px"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#191A24"
                  lineHeight="16px"
                >
                  {nftData?.nftInfo?.metadata?.name}
                </Text>
              </Flex>
            </Flex>
          </Link>
        </Flex>
      </Flex>
      <Container
        maxWidth="1364px"
        display="flex"
        flexDirection="column"
        width="100%"
        justifyContent="flex-start"
        alignItems={['center', 'center', 'center', 'center', 'flex-start']}
      >

        <Text
          p="40px 0px 20px 0px"
          textAlign="left"
          w="100%"
          fontSize="18px"
          fontFamily="TTHoves-Medium, TTHoves"
          fontWeight="500"
          color="#000000"
          lineHeight="22px"
        >
          { }
        </Text>
        <form style={{ width: '100%' }} onSubmit={formik.handleSubmit}>
          <Flex
            width="100%"
            flexDirection={['column', 'column', 'column', 'column', 'row']}
            justifyContent="space-between"
            alignItems={['center', 'center', 'center', 'center', 'flex-start']}
          >
            <Flex
              mr={['0', '0', '0', '0', '16px']}
              className="sellLeft"
              w={['100%', '100%', '100%', '100%', '790px']}
              flexDirection="column"
            >
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {ButtonArr.map((item, index) => (
                  <Button
                    key={item.id}
                    id={item.id}
                    width="254px"
                    height="80px"
                    borderRadius="4px"
                    border="1px solid #000000"
                    display="flex"
                    flexDirection="column"
                    onClick={handleSelect}
                    isDisabled={item.isDisabled}
                    variant="outline"
                    backgroundColor={selectId === index ? '#000000' : ''}
                    _hover={selectId === index ? {
                      background: '#000000',
                    } : {
                      background: '#FFFFFF',
                    }}
                  >
                    <Text
                      display="block"
                      fontSize="16px"
                      fontFamily="TTHoves-Medium, TTHoves"
                      fontWeight="500"
                      color={selectId === index ? '#FFFFFF' : '#000000'}
                      lineHeight="18px"
                    >
                      {item.title}
                    </Text>
                    <Text
                      display="block"
                      mt="8px"
                      fontSize="14px"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      color={selectId === index ? '#FFFFFF' : '#999999'}
                      lineHeight="14px"
                    >
                      {item.subtitle}
                    </Text>
                  </Button>
                ))}
              </Flex>
              {selectId === 0 ? (
                <>
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.setPrice')}
                      </Text>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.priceExplain')}
                      </Text>
                    </Flex>
                    <InputGroup
                      width="200px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #E5E5E5"
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
                        // placeholder={t('SellSetting.price')}
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
                        children="NMT"
                      />
                    </InputGroup>
                  </Flex>
                  {formik.errors.price && formik.touched.price ? (
                    <div style={{ color: 'red' }}>{formik.errors.price}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.pledge')}
                      </Text>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.pledgeExplain')}
                      </Text>
                    </Flex>
                    <Flex flexDirection="column" alignItems="flex-end">
                      <InputGroup
                        width="200px"
                        height="40px"
                        background="#FFFFFF"
                        borderRadius="4px"
                        border="1px solid #E5E5E5"
                      >
                        <Input
                          id="deposits"
                          name="deposits"
                          value={formik.values.deposits}
                          onChange={formik.handleChange}
                          fontSize="16px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="14px"
                          _focus={{
                            boxShadow: 'none',
                          }}
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
                          children="NMT"
                        />
                      </InputGroup>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.atLeast')}
                        1
                        {' '}
                        NMT
                      </Text>
                    </Flex>
                  </Flex>
                  {formik.errors.deposits && formik.touched.deposits ? (
                    <div style={{ color: 'red' }}>{formik.errors.deposits}</div>
                  ) : null}
                  <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
                    <AccordionItem width="100%" border="none">
                      <AccordionButton
                        height="62px"
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p="0"
                        borderBottom="1px solid #E5E5E5"
                        outline="none"
                        _focus={{
                          textDecoration: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <Flex height="100%" alignItems="center">
                          <Image
                            mr="8px"
                            w="22px"
                            h="22px"
                            src={IconSummary.default}
                          />
                          <Text
                            fontSize="16px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="500"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {t('SellSetting.Instructions')}
                          </Text>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel p="20px 0">
                        <Text
                          w="100%"
                          textAlign="left"
                          fontSize="13.9px"
                          fontFamily="TTHoves-Light, TTHoves"
                          fontWeight="300"
                          color="#000000"
                          lineHeight="22px"
                        >
                          {t('SellSetting.InstructionsExplain')}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </>
              ) : null}
              {selectId === 1 ? (
                <>
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.startingPrice')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.startingPriceExplain')}
                      </Text>
                    </Flex>
                    <InputGroup
                      width="200px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #E5E5E5"
                      _focus={{
                        boxShadow: 'none',

                      }}
                    >
                      <Input
                        id="startingPrice"
                        name="startingPrice"
                        value={formik.values.startingPrice}
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
                        // placeholder={t('SellSetting.price')}
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
                        children="NMT"
                      />
                    </InputGroup>
                  </Flex>
                  {formik.errors.startingPrice && formik.touched.startingPrice ? (
                    <div style={{ color: 'red' }}>{formik.errors.startingPrice}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.endingPrice')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.endingPriceExplain')}
                      </Text>
                    </Flex>
                    <InputGroup
                      width="200px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #E5E5E5"
                      _focus={{
                        boxShadow: 'none',
                      }}
                    >
                      <Input
                        id="endingPrice"
                        name="endingPrice"
                        value={formik.values.endingPrice}
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
                        // placeholder={t('SellSetting.price')}
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
                        children="NMT"
                      />
                    </InputGroup>
                  </Flex>
                  {formik.errors.endingPrice && formik.touched.endingPrice ? (
                    <div style={{ color: 'red' }}>{formik.errors.endingPrice}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.expirationDate')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.expirationDateExplain')}
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text
                        mt="8px"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="14px"
                        mr="9px"
                      >
                        at
                        {' '}
                        {date.format(new Date(), 'A hh:mm')}
                      </Text>
                      <InputGroup
                        width="200px"
                        height="40px"
                        background="#FFFFFF"
                        borderRadius="4px"
                        border="1px solid #E5E5E5"
                        _focus={{
                          boxShadow: 'none',
                        }}
                      >
                        <Input
                          id="expirationDate"
                          name="expirationDate"
                          value={formik.values.expirationDate}
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
                          placeholder={t('SellSetting.day')}
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
                          children="Days"
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                  {formik.errors.expirationDate && formik.touched.expirationDate ? (
                    <div style={{ color: 'red' }}>{formik.errors.expirationDate}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.turnToEnglishAuction')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.turnToEnglishAuctionExplain')}
                      </Text>
                    </Flex>
                    <Switch
                      id="turnToEnglishAuction"
                      name="turnToEnglishAuction"
                      isChecked={turnToEnglishAuction}
                      onChange={() => {
                        setTurnToEnglishAuction(!turnToEnglishAuction);
                        formik.values.turnToEnglishAuction = !turnToEnglishAuction;
                      }}
                      width="#40"
                      height="40px"
                      size="lg"
                    />
                  </Flex>
                  {formik.errors.turnToEnglishAuction && formik.touched.turnToEnglishAuction ? (
                    <div style={{ color: 'red' }}>{formik.errors.turnToEnglishAuction}</div>
                  ) : null}
                  {turnToEnglishAuction
                    ? (
                      <Flex
                        w="100%"
                        h="80px"
                        mt="20px"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Flex
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-start"
                        >
                          <Text
                            fontSize="16px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="500"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {t('SellSetting.minimumMarkup')}
                          </Text>
                          <Text
                            mt="8px"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#858999"
                            lineHeight="14px"
                          >
                            {t('SellSetting.minimumMarkupExplain')}
                          </Text>
                        </Flex>
                        <InputGroup
                          width="200px"
                          height="40px"
                          background="#FFFFFF"
                          borderRadius="4px"
                          border="1px solid #E5E5E5"
                          _focus={{
                            boxShadow: 'none',

                          }}
                        >
                          <Input
                            id="minimumMarkup"
                            name="minimumMarkup"
                            value={formik.values.minimumMarkup}
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
                            // placeholder={t('SellSetting.price')}
                            _placeholder={{
                              color: '#999999',
                              fontSize: '12px',
                            }}
                          />
                          <InputRightAddon
                            height="40px"
                            background="#F4F4F4"
                            borderRadius="0px 4px 4px 0px"
                            border="1px solid #E5E5E5"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                            children="%"
                          />
                        </InputGroup>
                      </Flex>
                    )
                    : null}
                  {formik.errors.minimumMarkup && formik.touched.minimumMarkup ? (
                    <div style={{ color: 'red' }}>{formik.errors.minimumMarkup}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.pledge')}
                      </Text>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.pledgeExplain')}
                      </Text>
                    </Flex>
                    <Flex flexDirection="column" alignItems="flex-end">
                      <InputGroup
                        width="200px"
                        height="40px"
                        background="#FFFFFF"
                        borderRadius="4px"
                        border="1px solid #E5E5E5"
                      >
                        <Input
                          id="dutchDeposits"
                          name="dutchDeposits"
                          value={formik.values.dutchDeposits}
                          onChange={formik.handleChange}
                          fontSize="16px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="14px"
                          _focus={{
                            boxShadow: 'none',
                          }}
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
                          children="NMT"
                        />
                      </InputGroup>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.atLeast')}
                        1
                        {' '}
                        NMT
                      </Text>
                    </Flex>
                  </Flex>
                  {formik.errors.dutchDeposits && formik.touched.dutchDeposits ? (
                    <div style={{ color: 'red' }}>{formik.errors.dutchDeposits}</div>
                  ) : null}
                  <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
                    <AccordionItem width="100%" border="none">
                      <AccordionButton
                        height="62px"
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p="0"
                        borderBottom="1px solid #E5E5E5"
                        outline="none"
                        _focus={{
                          textDecoration: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <Flex height="100%" alignItems="center">
                          <Image
                            mr="8px"
                            w="22px"
                            h="22px"
                            src={IconSummary.default}
                          />
                          <Text
                            fontSize="16px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="500"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {t('SellSetting.Instructions')}
                          </Text>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel p="20px 0">
                        <Text
                          w="100%"
                          textAlign="left"
                          fontSize="13.9px"
                          fontFamily="TTHoves-Light, TTHoves"
                          fontWeight="300"
                          color="#000000"
                          lineHeight="22px"
                        >
                          {t('SellSetting.InstructionsExplain')}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </>
              ) : null}
              {selectId === 2 ? (
                <>
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.startingPrice')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.startingPriceEng')}
                      </Text>
                    </Flex>
                    <InputGroup
                      width="200px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #E5E5E5"
                      _focus={{
                        boxShadow: 'none',

                      }}
                    >
                      <Input
                        id="startingPrice"
                        name="startingPrice"
                        value={formik.values.startingPrice}
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
                        // placeholder={t('SellSetting.price')}
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
                        children="NMT"
                      />
                    </InputGroup>
                  </Flex>
                  {formik.errors.startingPrice && formik.touched.startingPrice ? (
                    <div style={{ color: 'red' }}>{formik.errors.startingPrice}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.expirationDate')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.expirationDateExplain')}
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text
                        mt="8px"
                        fontSize="14px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#000000"
                        lineHeight="14px"
                        mr="9px"
                      >
                        at
                        {' '}
                        {date.format(new Date(), 'A hh:mm')}
                      </Text>
                      <InputGroup
                        width="200px"
                        height="40px"
                        background="#FFFFFF"
                        borderRadius="4px"
                        border="1px solid #E5E5E5"
                        _focus={{
                          boxShadow: 'none',

                        }}
                      >
                        <Input
                          id="expirationDate"
                          name="expirationDate"
                          value={formik.values.expirationDate}
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
                          placeholder={t('SellSetting.day')}
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
                          children="Days"
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                  {formik.errors.expirationDate && formik.touched.expirationDate ? (
                    <div style={{ color: 'red' }}>{formik.errors.expirationDate}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.automaticDelay')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.automaticDelayExplain')}
                      </Text>
                    </Flex>
                    <Switch
                      id="automaticDelay"
                      name="automaticDelay"
                      isChecked={automaticDelay}
                      onChange={() => {
                        formik.values.automaticDelay = !automaticDelay;
                        setAutomaticDelay(!automaticDelay);
                      }}
                      width="#40"
                      height="40px"
                      size="lg"
                    />
                  </Flex>
                  {formik.errors.automaticDelay && formik.touched.automaticDelay ? (
                    <div style={{ color: 'red' }}>{formik.errors.automaticDelay}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.minimumMarkup')}
                      </Text>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.minimumMarkupExplain')}
                      </Text>
                    </Flex>
                    <InputGroup
                      width="200px"
                      height="40px"
                      background="#FFFFFF"
                      borderRadius="4px"
                      border="1px solid #E5E5E5"
                      _focus={{
                        boxShadow: 'none',

                      }}
                    >
                      <Input
                        id="minimumMarkup"
                        name="minimumMarkup"
                        value={formik.values.minimumMarkup}
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
                        // placeholder={t('SellSetting.price')}
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
                        children="%"
                      />
                    </InputGroup>
                  </Flex>
                  {formik.errors.minimumMarkup && formik.touched.minimumMarkup ? (
                    <div style={{ color: 'red' }}>{formik.errors.minimumMarkup}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    mt="20px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.fixedPrice')}
                      </Text>
                      <Text
                        width="400px"
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.fixedPriceExplain')}
                      </Text>
                    </Flex>
                    <Flex flexDirection="column" justifyContent="space-between" alignItems="flex-end">
                      <Switch
                        id="endingPrice"
                        name="endingPrice"
                        isChecked={fixedPriceSl}
                        onChange={() => {
                          formik.values.fixedPriceSl = !fixedPriceSl;
                          setFixedPriceSl(!fixedPriceSl);
                        }}
                        width="#40"
                        height="40px"
                        size="lg"
                      />

                      {fixedPriceSl ? (
                        <InputGroup
                          width="200px"
                          height="40px"
                          background="#FFFFFF"
                          borderRadius="4px"
                          border="1px solid #E5E5E5"
                          _focus={{
                            boxShadow: 'none',

                          }}
                        >
                          <Input
                            id="fixedPrice"
                            name="fixedPrice"
                            value={formik.values.fixedPrice}
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
                            // placeholder={t('SellSetting.price')}
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
                            children="NMT"
                          />
                        </InputGroup>
                      ) : null}
                    </Flex>
                  </Flex>
                  {formik.errors.fixedPrice && formik.touched.fixedPrice ? (
                    <div style={{ color: 'red' }}>{formik.errors.fixedPrice}</div>
                  ) : null}
                  <Flex
                    w="100%"
                    h="80px"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.pledge')}
                      </Text>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.pledgeExplain')}
                      </Text>
                    </Flex>
                    <Flex flexDirection="column" alignItems="flex-end">
                      <InputGroup
                        width="200px"
                        height="40px"
                        background="#FFFFFF"
                        borderRadius="4px"
                        border="1px solid #E5E5E5"
                      >
                        <Input
                          id="englishDeposits"
                          name="englishDeposits"
                          value={formik.values.englishDeposits}
                          onChange={formik.handleChange}
                          fontSize="16px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="14px"
                          _focus={{
                            boxShadow: 'none',
                          }}
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
                          children="NMT"
                        />
                      </InputGroup>
                      <Text
                        mt="8px"
                        fontSize="12px"
                        fontFamily="TTHoves-Regular, TTHoves"
                        fontWeight="400"
                        color="#858999"
                        lineHeight="14px"
                      >
                        {t('SellSetting.atLeast')}
                        1
                        {' '}
                        NMT
                      </Text>
                    </Flex>
                  </Flex>
                  {formik.errors.englishDeposits && formik.touched.englishDeposits ? (
                    <div style={{ color: 'red' }}>{formik.errors.englishDeposits}</div>
                  ) : null}
                  <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
                    <AccordionItem width="100%" border="none">
                      <AccordionButton
                        height="62px"
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p="0"
                        borderBottom="1px solid #E5E5E5"
                        outline="none"
                        _focus={{
                          textDecoration: 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <Flex height="100%" alignItems="center">
                          <Image
                            mr="8px"
                            w="22px"
                            h="22px"
                            src={IconSummary.default}
                          />
                          <Text
                            fontSize="16px"
                            fontFamily="TTHoves-Medium, TTHoves"
                            fontWeight="500"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {t('SellSetting.Instructions')}
                          </Text>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel p="20px 0">
                        <Text
                          w="100%"
                          textAlign="left"
                          fontSize="13.9px"
                          fontFamily="TTHoves-Light, TTHoves"
                          fontWeight="300"
                          color="#000000"
                          lineHeight="22px"
                        >
                          {t('SellSetting.InstructionsExplain')}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </>
              ) : null}
            </Flex>
            <Flex width={['100%', '100%', '100%', '100%', '560px']}>
              <Accordion width="100%" defaultIndex={[0, 1, 2]} allowMultiple>
                <AccordionItem width="100%" border="none">
                  <AccordionButton
                    background="#F9F9F9"
                    p="0 20px"
                    height="62px"
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom="1px solid #E5E5E5"
                    outline="none"
                    _focus={{
                      textDecoration: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <Flex height="100%" alignItems="center">
                      <Image
                        mr="8px"
                        w="22px"
                        h="22px"
                        src={IconIntructions.default}
                      />
                      <Text
                        fontSize="16px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#000000"
                        lineHeight="18px"
                      >
                        {t('SellSetting.summary')}
                      </Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel background="#F9F9F9" p="0 20px">
                    <Flex
                      p="17px 0 20px 0"
                      flexDirection="column"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      borderBottom="1px solid #E5E5E5"
                    >
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                      >
                        <Text
                          fontSize="16px"
                          fontFamily="TTHoves-Medium, TTHoves"
                          fontWeight="500"
                          color="#232A4A"
                          lineHeight="18px"
                        >
                          {t('SellSetting.listing')}
                        </Text>
                        {selectId === 0 ? (
                          <Text
                            mt="12px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                          >
                            {t('SellSetting.listingExplainOne')}
                            {'  '}
                            {Number(formik.values.price).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {t('SellSetting.listingExplainTwo')}
                            {'  '}
                            {Number(Number(formik.values.price) * Number(1 - Math.ceil(number2PerU16((nftData?.nftInfo?.royalty_rate) + tax)) / 100)).toLocaleString() || 0}

                            {'  '}
                            NMT
                          </Text>
                        )
                          : null}
                        {selectId === 1 && i18n.language === 'en' ? (
                          <Text
                            mt="12px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                          >
                            {t('SellSetting.dutchExplainOne')}
                            {'  '}
                            {Number(formik.values.startingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {t('SellSetting.dutchExplainTwo')}
                            {'  '}
                            {Number(formik.values.endingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {'  '}
                            {t('SellSetting.dutchExplainThress')}
                            {actionTime(Number(formik.values.expirationDate) || 0)}
                          </Text>
                        ) : null}
                        {selectId === 1 && i18n.language === 'zh' ? (
                          <Text
                            mt="12px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                          >
                            {t('SellSetting.dutchExplainOne')}
                            {'  '}
                            {Number(formik.values.startingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {t('SellSetting.dutchExplainTwo')}
                            {'  '}
                            {actionTime(Number(formik.values.expirationDate) || 0)}
                            {'  '}
                            {t('SellSetting.dutchExplainThress')}
                            {Number(formik.values.endingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {'  '}
                            {t('SellSetting.dutchExplainFour')}
                          </Text>
                        ) : null}
                        {selectId === 2 && i18n.language === 'en' ? (
                          <Text
                            mt="12px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                          >
                            {t('SellSetting.englishExplainOne')}
                            {'  '}
                            {Number(formik.values.startingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {t('SellSetting.englishExplainTwo')}
                            {'  '}
                            {actionTime(Number(formik.values.expirationDate) || 0)}
                          </Text>
                        )
                          : null}
                        {selectId === 2 && i18n.language === 'zh' ? (
                          <Text
                            mt="12px"
                            fontSize="14px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="16px"
                          >
                            {t('SellSetting.englishExplainzhOne')}
                            {'  '}
                            {Number(formik.values.startingPrice).toLocaleString() || 0}
                            {'  '}
                            NMT
                            {t('SellSetting.englishExplainzhTwo')}
                            {'  '}
                            {actionTime(Number(formik.values.expirationDate) || 0)}
                            {'  '}
                            {t('SellSetting.englishExplainzhthree')}
                          </Text>
                        ) : null}
                      </Flex>
                      <Button
                        isLoading={isSubmitting}
                        mt="40px"
                        width="182px"
                        height="40px"
                        background="#000000"
                        borderRadius="4px"
                        fontSize="14px"
                        fontFamily="TTHoves-Medium, TTHoves"
                        fontWeight="500"
                        color="#FFFFFF"
                        lineHeight="16px"
                        type="submit"
                      >
                        {t('SellSetting.postYourListing')}
                      </Button>
                    </Flex>
                    {0 ? (
                      <Flex
                        p="20px 0 20px 0"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        borderBottom="1px solid #E5E5E5"
                      >
                        <Flex
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-start"
                        >
                          <Text
                            fontSize="16px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#000000"
                            lineHeight="18px"
                          >
                            {t('SellSetting.bounties')}
                          </Text>
                          <Text
                            width="213px"
                            mt="8px"
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                          >
                            {t('SellSetting.bountiesExplain')}
                          </Text>
                        </Flex>
                        <Flex
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-end"
                        >
                          <Switch
                            isChecked={commissionRateSl}
                            onChange={() => {
                              setcommissionRateSl(!commissionRateSl);
                            }}
                            height="40px"
                            size="lg"
                          />
                          {commissionRateSl ? (
                            <InputGroup
                              mt="10px"
                              width="200px"
                              height="40px"
                              background="#FFFFFF"
                              borderRadius="4px"
                              border="1px solid #E5E5E5"
                            >
                              <Input
                                id="commissionRate"
                                name="commissionRate"
                                value={commissionRateSl ? formik.values.commissionRate : 0}
                                onChange={formik.handleChange}
                                fontSize="12px"
                                fontFamily="TTHoves-Regular, TTHoves"
                                fontWeight="400"
                                color="#000000"
                                lineHeight="14px"
                                _focus={{
                                  boxShadow: 'none',
                                  color: '#000000',
                                }}
                                placeholder="0"
                              />
                              <InputRightAddon
                                width="54px"
                                height="40px"
                                background="#F4F4F4"
                                borderRadius="0px 4px 4px 0px"
                                border="1px solid #E5E5E5"
                                fontSize="14px"
                                fontFamily="TTHoves-Regular, TTHoves"
                                fontWeight="400"
                                color="#999999"
                                lineHeight="14px"
                                children="%"
                              />
                            </InputGroup>
                          )
                            : null}
                        </Flex>

                      </Flex>
                    )
                      : null}
                    {nftData?.nftInfo?.royalty_rate
                      ? (
                        <Flex
                          p="20px 0 20px 0"
                          flexDirection="column"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          borderBottom="1px solid #E5E5E5"
                        >
                          <Flex
                            w="100%"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="flex-start"
                          >
                            <Text
                              fontSize="16px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="18px"
                            >
                              {t('SellSetting.royalties')}
                            </Text>
                            <Text
                              mt="8px"
                              fontSize="12px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#999999"
                              lineHeight="14px"
                            >
                              {t('SellSetting.royaltiesExplain')}
                            </Text>
                          </Flex>
                          <Flex
                            m="23px 0 4px 0"
                            width="100%"
                            h="16px"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="16px"
                            >
                              {t('SellSetting.toTheBeneficiary')}
                            </Text>
                            <Progress
                              width="300px"
                              height="3px"
                              borderRadius="2px"
                              value={Math.ceil(number2PerU16(nftData?.nftInfo?.royalty_rate))}
                            />
                            <Text
                              fontSize="14px"
                              fontFamily="TTHoves-Regular, TTHoves"
                              fontWeight="400"
                              color="#000000"
                              lineHeight="16px"
                            >
                              {nftData?.nftInfo?.royalty_rate ? number2PerU16(nftData?.nftInfo?.royalty_rate).toFixed(1) : 0}
                              %
                            </Text>
                          </Flex>

                        </Flex>
                      )
                      : ''}
                    <Flex
                      p="20px 0 20px 0"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Flex
                        w="100%"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                      >
                        <Text
                          fontSize="16px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="18px"
                        >
                          {t('SellSetting.tax')}
                        </Text>
                        <Text
                          mt="8px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="14px"
                        >
                          {t('SellSetting.taxExplain')}
                        </Text>
                      </Flex>
                      <Flex
                        m="23px 0 4px 0"
                        width="100%"
                        h="16px"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="16px"
                        >
                          {t('SellSetting.toNFTMartTreasury')}
                        </Text>
                        <Progress
                          width="300px"
                          height="3px"
                          borderRadius="2px"
                          value={number2PerU16(tax)}
                        />
                        <Text
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="16px"
                        >
                          {Math.ceil(number2PerU16(tax))}
                          %
                        </Text>
                      </Flex>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Flex>
        </form>
        <LoginDetector />
        <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
          <ModalOverlay />
        </Modal>
      </Container>
      <MyToast isCloseable />
    </MainContainer>

  );
};

export default SellSetting;
