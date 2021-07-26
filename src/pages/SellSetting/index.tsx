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
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
  useHistory, RouteComponentProps, Link as RouterLink,
} from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import MainContainer from '../../layout/MainContainer';
import colors from '../../themes/colors';
import useNft from '../../hooks/reactQuery/useNft';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import useCategories from '../../hooks/reactQuery/useCategories';
import LoginDetector from '../../components/LoginDetector';

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
import MyToast, { ToastBody } from '../../components/MyToast';

const SellSetting = ({ match }: RouteComponentProps<{ nftId: string }>) => {
  const { t } = useTranslation();
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
      isDisabled: true,
    },
    {
      id: 2,
      title: t('SellSetting.englishAuction'),
      subtitle: t('SellSetting.auctionToTheHighestBidder'),
      isDisabled: true,
    },
  ];
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const history = useHistory();

  const [selectId, setSelectId] = useState(0);
  const { nftId } = match.params;
  const collectionsId = nftId.split('-')[0];

  const { data: nftData } = useNft(nftId);
  const { data: categoriesData } = useCategories();
  const { data: collectionsData } = useCollectionsSinger(collectionsId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
    setSelectId(Number(event.currentTarget.id));
  };

  const schema = Yup.object().shape({
    price: Yup.number().moreThan(0).required(t('Create.Required')),
    categoryId: Yup.string().required(t('Create.Required')),
  });

  const formik = useFormik({
    initialValues: {
      price: '',
      categoryId: '',
    },
    onSubmit: (formValue, formAction) => {
      setIsSubmitting(true);
      const orderParams = {
        address: account!.address,
        categoryId: formValue.categoryId,
        price: formValue.price,
        classId: nftData?.nftInfo.class_id,
        quantity: nftData?.nftInfo.quantity,
        tokenId: nftData?.nftInfo.token_id,
        cb: {
          success: () => {
            toast(<ToastBody title="Success" message={t('Create.Success')} type="success" />);
            setIsSubmitting(false);
            formAction.resetForm();
            setTimeout(() => {
              history.push(`/item/${nftData?.nftInfo?.id}`);
            }, 1000);
          },
          error: (error) => {
            toast(<ToastBody title="Error" message={error} type="error" />);
            setIsSubmitting(false);
          },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createOrder(orderParams as any);
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={t('SellSetting.title')}>
      <Flex
        w="100vw"
        h="80px"
        background="#F9F9F9"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link
          as={RouterLink}
          to={`/item/${nftData?.nftInfo?.id}`}
        >
          <Flex
            w="1364px"
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
              src={`${PINATA_SERVER}${nftData?.nftInfo?.metadata?.logoUrl}`}
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
                {collectionsData?.collection?.metadata.name}
              </Text>
              <Text
                mt="5px"
                fontSize="14px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color="#191A24"
                lineHeight="16px"
              >
                {nftData?.nftInfo?.metadata.name}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </Flex>
      <Container
        display="flex"
        flexDirection="column"
        width="100%"
        justifyContent="flex-start"
        alignItems="flex-start"
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
        <form onSubmit={formik.handleSubmit}>
          <Flex
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Flex
              className="sellLeft"
              w="790px"
              flexDirection="column"
            >
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {ButtonArr.map((item, index) => (
                  <Button
                    key={item.title}
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
                    children="NMT"
                  />
                </InputGroup>
              </Flex>
              {formik.errors.price && formik.touched.price ? (
                <div style={{ color: 'red' }}>{formik.errors.price}</div>
              ) : null}
              {/* <Flex
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
                    {t('SellSetting.Pledge')}
                  </Text>
                  <Text
                    mt="8px"
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#858999"
                    lineHeight="14px"
                  >
                    {t('SellSetting.PledgeExplain')}
                  </Text>
                </Flex>
                <InputGroup
                  width="200px"
                  height="40px"
                  background="#FFFFFF"
                  borderRadius="4px"
                  border="1px solid #E5E5E5"
                >
                  <Input
                    fontSize="12px"
                    fontFamily="TTHoves-Regular, TTHoves"
                    fontWeight="400"
                    color="#999999"
                    lineHeight="14px"
                    _focus={{
                      boxShadow: 'none',
                    }}
                    placeholder={t('SellSetting.Price')}
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
              </Flex> */}
              <Text
                mt="20px"
                mb="8px"
                fontSize="16px"
                fontFamily="TTHoves-Medium, TTHoves"
                fontWeight="500"
                color="#000000"
                lineHeight="18px"
              >
                {t('SellSetting.categories')}
              </Text>
              <RadioGroup
                color={colors.text.gray}
                onChange={(value: string) => {
                  formik.values.categoryId = value;
                }}
              >
                <Stack direction="row" spacing={6}>
                  {categoriesData
                    && categoriesData?.categories?.map((item) => (
                      <Radio
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </Radio>
                    ))}
                </Stack>
              </RadioGroup>
              {formik.errors.categoryId && formik.touched.categoryId ? (
                <div style={{ color: 'red' }}>{formik.errors.price}</div>
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
                        {t('SellSetting.Intructions')}
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
                      {t('SellSetting.IntructionsExplain')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
            <Flex width="560px" ml="16px">
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
                        {t('SellSetting.Summary')}
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
                          {t('SellSetting.Listing')}
                        </Text>
                        <Text
                          mt="12px"
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="16px"
                        >
                          {t('SellSetting.ListingExplainone')}
                          {t('SellSetting.ListingExplaintwo')}
                        </Text>
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
                        {t('SellSetting.PostYourListing')}
                      </Button>
                    </Flex>
                    {/* <Flex
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
                          {t('SellSetting.Bounties')}
                        </Text>
                        <Text
                          width="200px"
                          mt="8px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="14px"
                        >
                          {t('SellSetting.BountiesExplain')}
                        </Text>
                      </Flex>
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-end"
                      >
                        <Switch colorScheme="teal" size="lg" />
                        <InputGroup
                          mt="10px"
                          width="200px"
                          height="40px"
                          background="#FFFFFF"
                          borderRadius="4px"
                          border="1px solid #E5E5E5"
                        >
                          <Input
                            fontSize="12px"
                            fontFamily="TTHoves-Regular, TTHoves"
                            fontWeight="400"
                            color="#999999"
                            lineHeight="14px"
                            _focus={{
                              boxShadow: 'none',
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
                      </Flex>

                    </Flex>
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
                          {t('SellSetting.Royalties')}
                        </Text>
                        <Text
                          mt="8px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="14px"
                        >
                          {t('SellSetting.RoyaltiesExplain')}
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
                          {t('SellSetting.Tothebeneficiary')}
                        </Text>
                        <Progress width="378px" height="3px" borderRadius="2px" value={20} colorScheme={colors.black} />
                        <Text
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="16px"
                        >
                          0%
                        </Text>
                      </Flex>

                    </Flex> */}
                    {/* <Flex
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
                          {t('SellSetting.Tax')}
                        </Text>
                        <Text
                          mt="8px"
                          fontSize="12px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#999999"
                          lineHeight="14px"
                        >
                          {t('SellSetting.TaxExplain')}
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
                          {t('SellSetting.ToNFTMartTreasury')}
                        </Text>
                        <Progress width="378px" height="3px" borderRadius="2px" value={20} colorScheme={colors.black} />
                        <Text
                          fontSize="14px"
                          fontFamily="TTHoves-Regular, TTHoves"
                          fontWeight="400"
                          color="#000000"
                          lineHeight="16px"
                        >
                          0%
                        </Text>
                      </Flex>
                    </Flex> */}
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
