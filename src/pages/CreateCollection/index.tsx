/* eslint-disable react/no-children-prop */
import React, {
  FC, useCallback, useState, useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  useFormik,
} from 'formik';
import { toast } from 'react-toastify';
import {
  Flex,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import useParams from '../../hooks/url/useParams';
import Upload from '../../components/Upload';
import EditFormTitle from '../../components/EditFormTitle';
import EditFromSubTitle from '../../components/EditFromSubTitle';
import FormInput from '../../components/FormInput';
import LeftAddonInput from '../../components/LeftAddonInput';
import FromTextarea from '../../components/FromTextarea';
import SubmitButton from '../../components/SubmitButton';
import LoginDetector from '../../components/LoginDetector';
import { createClass } from '../../polkaSDK/api/createClass';
import { useAppSelector } from '../../hooks/redux';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);

  const { account, whiteList } = chainState;
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCloseModal = () => {
    setIsShowModal(false);
    history.push('/');
  };

  useEffect(() => {
    if (!account || whiteList.indexOf(account?.address) < 0) {
      setIsShowModal(true);
    }
  }, [account, whiteList]);

  const create = useCallback((formValue, formActions) => {
    createClass({
      address: account!.address,
      metadata: {
        logoUrl: formValue.logoUrl,
        featuredUrl: formValue.featuredUrl,
        name: formValue.name,
        stub: formValue.stub,
        description: formValue.description,
      },
      cb: {
        success: (result: any) => {
          if (result.dispatchError) {
            toast(<ToastBody title="Error" message={t('create.create.error')} type="error" />);
          } else {
            toast(<ToastBody title="Success" message={t('Collection.Success')} type="success" />);
            setTimeout(() => {
              history.push(`/collection/${account!.address}?collectionId=${result.events[5].event.data[1].toString()}`);
            }, 3000);
          }

          setIsSubmitting(false);
          formActions.resetForm();
        },
        error: (error: any) => {
          toast(<ToastBody title="Error" message={t('create.create.error')} type="error" />);
          setIsSubmitting(false);
          formActions.resetForm();
        },
      },
    });
  }, [account, t]);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Collection.Required')),
    name: Yup.string()
      .max(50, t('Collection.nameRule'))
      .required(t('Collection.Required')),
    stub: Yup.string().max(50, t('Collection.urlRule')),
    description: Yup.string().max(1000, t('Collection.descriptionRule')),
  });

  const formik = useFormik({
    initialValues: {
      logoUrl: '',
      featuredUrl: '',
      name: '',
      stub: '',
      description: '',
    },
    onSubmit: (values, formActions) => {
      setIsSubmitting(true);
      create(values, formActions);
    },
    validationSchema: schema,
  });
  const params = useParams();
  const collectionId = params.get('collectionId') || '';

  return (
    <Flex
      marginTop="120px"
      w="600px"
      minHeight="100vh"
    >
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="logoUrl">
          {' '}
          <EditFormTitle text={t('Collection.logo')} />
          <EditFromSubTitle text={t('Collection.logoRule')} />
        </label>

        <Upload
          id="logoUrl"
          mediatype="cutting"
          rectangle=""
          value={formik.values.logoUrl}
          onChange={(v: any) => {
            formik.setFieldValue('logoUrl', v);
          }}
        />
        {formik.errors.logoUrl && formik.touched.logoUrl ? (
          <div style={{ color: 'red' }}>{formik.errors.logoUrl}</div>
        ) : null}
        {/* <label htmlFor="featuredUrl">
          {' '}
          <EditFormTitle text={t('Collection.featured')} />
          <EditFromSubTitle text={t('Collection.featuredRule')} />
        </label>
        {formik.errors.featuredUrl && formik.touched.featuredUrl ? (
          <div style={{ color: 'red' }}>{formik.errors.featuredUrl}</div>
        ) : null}
        <Upload
          id="featuredUrl"
          mediatype="cutting"
          rectangle="rectangle"
          value={formik.values.featuredUrl}
          onChange={(v: any) => {
            formik.setFieldValue('featuredUrl', v);
          }}
        /> */}
        <label htmlFor="name">
          {' '}
          <EditFormTitle text={t('Collection.name')} />
          <EditFromSubTitle text={t('Collection.nameRule')} />
        </label>
        <FormInput id="name" value={formik.values.name} onChange={formik.handleChange} />
        {formik.errors.name && formik.touched.name ? (
          <div style={{ color: 'red' }}>{formik.errors.name}</div>
        ) : null}
        <label htmlFor="stub">
          {' '}
          <EditFormTitle text={t('Collection.url')} />
          <EditFromSubTitle
            text={t('Collection.urlRule')}
          />
        </label>
        <LeftAddonInput
          id="stub"
          value={formik.values.stub}
          onChange={formik.handleChange}
          url="https://nftmart.io/collection/"
        />
        {formik.errors.stub && formik.touched.stub ? (
          <div style={{ color: 'red' }}>{formik.errors.stub}</div>
        ) : null}
        <label htmlFor="description">
          {' '}
          <EditFormTitle text={t('Collection.description')} />
          <EditFromSubTitle text={t('Collection.descriptionRule')} />
        </label>
        <FromTextarea id="description" onChange={formik.handleChange} value={formik.values.description} />
        {formik.errors.description && formik.touched.description ? (
          <div style={{ color: 'red' }}>{formik.errors.description}</div>
        ) : null}
        <Flex
          w="600px"
          justifyContent="center"
        >
          <SubmitButton text={t('Collection.submit')} isSubmitting={isSubmitting} />
        </Flex>
      </form>
      <Modal isOpen={isSubmitting} onClose={() => setIsSubmitting(false)}>
        <ModalOverlay />
      </Modal>
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
    </Flex>
  );
};

export default CreateCollection;
