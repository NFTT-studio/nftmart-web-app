import React, { useCallback, useState } from 'react';
import {
  useHistory, RouteComponentProps, Link as RouterLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import {
  useFormik,
} from 'formik';

import {
  useToast,
  Flex,
  Image,
  Text,
  Link,
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
  IconDetailsocllections,
  IconDetailsRefresh,
  IconDetailshaSre,
  IconDetailsCollection,
  Emptyimg,
  IconLeft,
} from '../../assets/images';
import { mintNft } from '../../polkaSDK/api/mintNft';

const CreateNft = ({ match }: RouteComponentProps<{ collectionId: string }>) => {
  const { t } = useTranslation();
  const toast = useToast();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const { collectionId } = match.params;
  const { account } = chainState;

  const { data: collectionsData } = useCollectionsSinger(collectionId);
  const [Submitting, setSubmitting] = useState(false);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Create.Required')),
    name: Yup.string()
      .max(50, t('Create.nameRule'))
      .required(t('Create.Required')),
    stub: Yup.string().max(50, t('Create.urlRule')),
    description: Yup.string().max(1000, t('Create.descriptionRule')),
  });

  const mint = useCallback(async (formValue, cb) => {
    const { ...others } = formValue;
    const normalizedFormData = {
      address: account?.address,
      metadata: { ...others },
      classId: Number(collectionId),
      cb,
    };
    mintNft(normalizedFormData);
  }, [account?.address, collectionId]);

  const formik = useFormik({
    initialValues: {
      logoUrl: '',
      featuredUrl: '',
      name: '',
      stub: '',
      description: '',
    },
    onSubmit: (formValue, formAction) => {
      setSubmitting(true);
      mint(formValue, {
        success: () => {
          toast({
            title: t('create.detailtoast.success'),
            status: 'success',
            position: 'top',
            duration: 3000,
          });
          setSubmitting(false);
          formAction.resetForm();
        },
        error: (error: string) => {
          toast({
            title: 'error',
            status: 'error',
            position: 'top',
            duration: 3000,
            description: error,
          });
          setSubmitting(false);
        },
      });
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={t('Collection.title')}>
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
            w="1360px"
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
            value={formik.values.logoUrl}
            onChange={(v: any) => {
              formik.setFieldValue('logoUrl', v);
            }}
          />
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
          <LeftAddonInput id="stub" value={formik.values.stub} onChange={formik.handleChange} />
          <label htmlFor="description">
            {' '}
            <EditFormTitle text={t('Create.description')} />
            <EditFromSubTitle text={t('Create.descriptionRule')} />
          </label>
          <FromTextarea id="description" onChange={formik.handleChange} value={formik.values.description} />
          <Flex
            w="600px"
            justifyContent="center"
          >
            <SubmitButton text={t('Create.submit')} isSubmitting={Submitting} />
          </Flex>
        </form>
        <LoginDetector />
      </Flex>
    </MainContainer>
  );
};

export default CreateNft;
