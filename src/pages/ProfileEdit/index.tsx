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
  Image,
  Switch,
  InputRightAddon,
  InputGroup,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { F } from 'ramda';
import Upload from '../../components/Upload';
import EditFormTitle from '../../components/EditFormTitle';
import EditFromSubTitle from '../../components/EditFromSubTitle';
import FormInput from '../../components/FormInput';
import LeftAddonInput from '../../components/LeftAddonInput';
import LeftImgonInput from '../../components/LeftImgonInput';
import FromTextarea from '../../components/FromTextarea';
import SubmitButton from '../../components/SubmitButton';
import { createClass } from '../../polkaSDK/api/createClass';
import { useAppSelector } from '../../hooks/redux';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';

import {

} from '../../assets/images';

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

  // const create = useCallback((formValue, formActions) => {

  // }, [account, history, t]);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Collection.required')),
    name: Yup.string()
      .max(50, t('Collection.nameRule'))
      .required(t('Collection.required')),
    stub: Yup.string().max(50, t('Collection.urlRule')),
    description: Yup.string().max(1000, t('Collection.descriptionRule')),
    royalties: Yup.number().max(20, t('Collection.royaltiesSchema')).min(0, t('Collection.royaltiesSchema')),
    cate: Yup.string().required(t('Collection.required')),
  });

  const formik = useFormik({
    initialValues: {
      logoUrl: '',
      username: '',
      twitter: '',
      emai: '',
      medium: '',
      telegram: '',
    },
    onSubmit: (values, formActions) => {
      setIsSubmitting(true);
      // create(values, formActions);
    },
    validationSchema: schema,
  });

  return (
    <Flex
      marginTop="120px"
      w="600px"
      minHeight="100vh"
    >
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="portrait">
          {' '}
          <EditFormTitle text={t('Collection.portrait')} />
          <EditFromSubTitle text={t('Collection.portraitRule')} />
        </label>
        {formik.errors.logoUrl && formik.touched.logoUrl ? (
          <div style={{ color: 'red' }}>{formik.errors.logoUrl}</div>
        ) : null}
        <label htmlFor="username">
          {' '}
          <EditFormTitle text={t('ProfileEdit.username')} />
          <EditFromSubTitle text={t('ProfileEdit.usernameRule')} />
        </label>
        <FormInput id="username" value={formik.values.username} onChange={formik.handleChange} />
        {formik.errors.username && formik.touched.username ? (
          <div style={{ color: 'red' }}>{formik.errors.username}</div>
        ) : null}
        <label htmlFor="emai">
          {' '}
          <EditFormTitle text={t('ProfileEdit.emai')} />
          <EditFromSubTitle text={t('CProfileEdit.emaiRule')} />
        </label>
        <FormInput id="emai" value={formik.values.emai} onChange={formik.handleChange} />
        {formik.errors.emai && formik.touched.emai ? (
          <div style={{ color: 'red' }}>{formik.errors.emai}</div>
        ) : null}
        <label htmlFor="twitter">
          {' '}
          <EditFormTitle text={t('ProfileEdit.twitter')} />
          <EditFromSubTitle text={t('ProfileEdit.twitterRule')} />
        </label>
        <FormInput id="twitter" value={formik.values.twitter} onChange={formik.handleChange} />
        {formik.errors.twitter && formik.touched.twitter ? (
          <div style={{ color: 'red' }}>{formik.errors.twitter}</div>
        ) : null}
        <label htmlFor="featuredImage">
          {' '}
          <EditFormTitle text={t('ProfileEdit.featuredImage')} />
          <EditFromSubTitle text={t('ProfileEdit.featuredImageRule')} />
        </label>
        <Flex
          w="600px"
          justifyContent="center"
        >
          <SubmitButton text={t('common.save')} isSubmitting={isSubmitting} />
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
    </Flex>
  );
};

export default CreateCollection;
