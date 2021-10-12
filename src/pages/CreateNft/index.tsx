/* eslint-disable react/no-children-prop */
import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  useHistory, RouteComponentProps, Link as RouterLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import {
  useFormik,
} from 'formik';
import { toast } from 'react-toastify';
import {
  Flex,
  Image,
  Text,
  Link,
  Modal,
  ModalOverlay,
  InputRightAddon,
  InputGroup,
  Input,
  Box,
  Switch,
} from '@chakra-ui/react';
import useCollectionsSinger from '../../hooks/reactQuery/useCollectionsSinger';
import Upload from '../../components/Upload';
import EditFormTitle from '../../components/EditFormTitle';
import EditFromSubTitle from '../../components/EditFromSubTitle';
import SubmitButton from '../../components/SubmitButton';
import FormInput from '../../components/FormInput';
import FromTextarea from '../../components/FromTextarea';
import LeftAddonInput from '../../components/LeftAddonInput';
import { useAppSelector } from '../../hooks/redux';
import LoginDetector from '../../components/LoginDetector';
import MainContainer from '../../layout/MainContainer';

import {
  PINATA_SERVER,
} from '../../constants';
import {
  IconLeft,
} from '../../assets/images';
import { mintNft } from '../../polkaSDK/api/mintNft';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';

const CreateNft = ({ match }: RouteComponentProps<{ collectionId: string }>) => {
  const { t } = useTranslation();

  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const { collectionId } = match.params;
  const { account, whiteList } = chainState;
  const [isShowModal, setIsShowModal] = useState(false);
  const [preview, setIsPreview] = useState(false);
  const [royaltiesSl, setroyaltiesSl] = useState(false);
  const onCloseModal = () => {
    setIsShowModal(false);
    history.push('/');
  };
  useEffect(() => {
    if (!account || whiteList.indexOf(account?.address) < 0) {
      setIsShowModal(true);
    }
  }, [account, whiteList]);
  const { data: collectionsData } = useCollectionsSinger(collectionId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Create.required')),
    name: Yup.string()
      .max(50, t('Create.nameRule'))
      .required(t('Create.required')),
    stub: Yup.string().max(50, t('Create.urlRule')),
    description: Yup.string().max(1000, t('Create.descriptionRule')),
    royalties: Yup.number().max(20, t('Collection.royaltiesSchema')).min(0, t('Collection.royaltiesSchema')),
  });

  const mint = useCallback(async (formValue, cb) => {
    formValue.stub = `https://${formValue.stub}`;
    const { ...others } = formValue;
    const normalizedFormData = {
      address: account?.address,
      metadata: { ...others },
      classId: Number(collectionId),
      quantity: 1,
      royaltyRate: Number(formValue.royalties) / 100,
      cb,
      setIsShow: setIsSubmitting,
    };
    mintNft(normalizedFormData);
  }, [account?.address, collectionId]);

  const formik = useFormik({
    initialValues: {
      logoUrl: '',
      previewUrl: '',
      name: '',
      stub: '',
      description: '',
      royalties: 0,
      fileType: '',
    },
    onSubmit: (formValue, formAction) => {
      setIsSubmitting(true);
      mint(formValue, {
        success: () => {
          toast(<ToastBody title="Success" message={t('common.success')} type="success" />);
          setIsSubmitting(false);
          formAction.resetForm();
          setTimeout(() => {
            history.push(`/collection/${account!.address}?collectionId=${collectionId}`);
          }, 3000);
        },
        error: (error: string) => {
          toast(<ToastBody title="Error" message={error} type="error" />);
          setIsSubmitting(false);
        },
      });
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={t('Create.title')}>
      <Flex
        w="100%"
        h="80px"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link
          as={RouterLink}
          to={`/collection/${account?.address}?collectionId=${collectionsData?.collection?.id}`}
        >
          <Flex
            maxW="1364px"
            w="100vw"
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
              src={`${PINATA_SERVER}${collectionsData?.collection?.metadata.logoUrl}`}
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
            </Flex>
          </Flex>
        </Link>
      </Flex>
      <Flex
        w="600px"
        flexDirection="column"
        position="relative"
        top="-54px"
      >
        <Text
          mb="21px"
          w="100%"
          textAlign="center"
          fontSize="22px"
          fontFamily="TTHoves-Bold, TTHoves"
          fontWeight="bold"
          color="#191A24"
          lineHeight="27px"
        >
          {t('Create.createCollection')}
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="logoUrl">
            {' '}
            <EditFormTitle text={t('Create.logo')} />
            <EditFromSubTitle text={t('Create.logoRule')} />
          </label>
          <Upload
            id="logoUrl"
            mediatype="nocutting"
            rectangle=""
            proportion={16 / 16}
            value={formik.values.logoUrl}
            onChange={(v, b) => {
              formik.setFieldValue('logoUrl', v);
              formik.setFieldValue('fileType', b);
              if (b !== 'gif' && b !== 'png' && b !== 'jpg' && b !== 'jpg' && b !== '' && b !== 'jpeg') {
                setIsPreview(true);
              } else {
                setIsPreview(false);
              }
            }}
          />
          {preview
            ? (
              <>
                <label htmlFor="previewUrl">
                  {' '}
                  <EditFormTitle text={t('Create.preview')} />
                  <EditFromSubTitle text={t('Create.previewRule')} />
                </label>
                <Upload
                  id="previewUrl"
                  mediatype="img"
                  rectangle=""
                  proportion={16 / 16}
                  value={formik.values.previewUrl}
                  onChange={(v, b) => {
                    formik.setFieldValue('previewUrl', v);
                  }}
                />
              </>
            ) : null}

          {/* <label htmlFor="featuredUrl">
            {' '}
            <EditFormTitle text={t('Create.featured')} />
            <EditFromSubTitle text={t('Create.featuredRule')} />
          </label>
          <Upload
            id="featuredUrl"
            mediatype="nocutting"
            rectangle="rectangle"
            value={formik.values.featuredUrl}
            onChange={(v: any) => {
              formik.setFieldValue('featuredUrl', v);
            }}
          /> */}
          <label htmlFor="name">
            {' '}
            <EditFormTitle text={t('Create.name')} />
            <EditFromSubTitle text={t('Create.nameRule')} />
          </label>
          <FormInput id="name" value={formik.values.name} onChange={formik.handleChange} />
          {formik.errors.name && formik.touched.name ? (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          ) : null}
          <label htmlFor="stub">
            {' '}
            <EditFormTitle text={t('Create.url')} />
            <EditFromSubTitle text={t('Create.urlRule')} />
          </label>
          <LeftAddonInput
            id="stub"
            value={formik.values.stub}
            onChange={formik.handleChange}
            url="https://"
          />
          <label htmlFor="description">
            {' '}
            <EditFormTitle text={t('Create.description')} />
            <EditFromSubTitle text={t('Create.descriptionRule')} />
          </label>
          <FromTextarea id="description" onChange={formik.handleChange} value={formik.values.description} />
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
                {t('Collection.royalties')}
              </Text>
              <Box
                display={royaltiesSl ? 'flex' : 'none'}
                width="349px"
                mt="8px"
                fontSize="14px"
                fontFamily="TTHoves-Regular, TTHoves"
                fontWeight="400"
                color="#999999"
                lineHeight="16px"
                flexDirection="column"
              >
                <Text
                  display="inline-block"
                >
                  {t('Collection.royaltiesRule')}
                </Text>
                <Flex>
                  <Text
                    display="inline-block"
                  >
                    {t('Collection.royaltiesRuleTwo')}
                  </Text>
                  <Text
                    ml="3px"
                    height="16px"
                    display="inline-block"
                    color="#000000"
                  >
                    20%
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Flex flexDirection="column" justifyContent="space-between" alignItems="flex-end">
              <Switch
                isChecked={royaltiesSl}
                onChange={() => {
                  setroyaltiesSl(!royaltiesSl);
                }}
                height="40px"
                size="lg"
              />
              <InputGroup
                display={royaltiesSl ? 'flex' : 'none'}
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
                  id="royalties"
                  name="royalties"
                  value={royaltiesSl ? formik.values.royalties : 0}
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
                  placeholder="0"
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
          </Flex>
          {formik.errors.royalties && formik.touched.royalties ? (
            <div style={{ color: 'red' }}>{formik.errors.royalties}</div>
          ) : null}
          <Flex
            w="600px"
            justifyContent="center"
          >
            <SubmitButton text={t('common.save')} isSubmitting={isSubmitting} />
          </Flex>
        </form>
        <MyModal
          isOpen={isShowModal}
          type="warning"
          isCloseable
          title="You are not in the whitelist"
          message="Please contact our team"
          onClose={onCloseModal}
        />
        <MyToast isCloseable />
        <LoginDetector />
        <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
          <ModalOverlay />
        </Modal>
      </Flex>
    </MainContainer>
  );
};

export default CreateNft;
