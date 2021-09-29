/* eslint-disable react/no-children-prop */
import React, {
  FC, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  useFormik,
} from 'formik';
import {
  Flex,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import UploadPersonal from '../../components/UploadPersonal';
import EditFormTitle from '../../components/EditFormTitle';
import EditFromSubTitle from '../../components/EditFromSubTitle';
import FormInput from '../../components/FormInput';
import SubmitButton from '../../components/SubmitButton';
import MyModal from '../../components/MyModal';
import MyToast from '../../components/MyToast';
import { useAppSelector } from '../../hooks/redux';
import useUser from '../../hooks/reactQuery/useUser';
import { CACHE_SERVER_URL } from '../../constants';

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;

  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: userData } = useUser(account?.address);
  console.log(userData);

  const onCloseModal = () => {
    setIsShowModal(false);
    history.push('/');
  };

  // const create = useCallback((formValue, formActions) => {

  // }, [account, history, t]);

  const schema = Yup.object().shape({
    // portrait: Yup.string().required(t('Collection.required')),
    // username: Yup.string()
    //   .max(50, t('Collection.nameRule'))
    //   .required(t('Collection.required')),
    // stub: Yup.string().max(50, t('Collection.urlRule')),
    // description: Yup.string().max(1000, t('Collection.descriptionRule')),
    // royalties: Yup.number().max(20, t('Collection.royaltiesSchema')).min(0, t('Collection.royaltiesSchema')),
    // cate: Yup.string().required(t('Collection.required')),
  });

  const formik = useFormik({
    initialValues: {
      name: userData?.name,
      avatar: userData?.avatar,
      featured_image: userData?.featured_image,
      twitter: userData?.twitter,
      email: userData?.email,
    },
    onSubmit: async (values, formActions) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('id', account?.address || '');
      formData.append('name', values.name);
      formData.append('avatar', values.avatar);
      formData.append('featured_image', values.featured_image);
      formData.append('twitter', values.twitter);
      formData.append('email', values.email);
      await axios.post(`${CACHE_SERVER_URL}accounts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        setIsSubmitting(false);
        history.push(`/account/${account?.address}/wallet`);
      });
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
        <label htmlFor="avatar">
          {' '}
          <EditFormTitle text={t('ProfileEdit.portrait')} />
          <EditFromSubTitle text={t('ProfileEdit.portraitRule')} />
        </label>
        <UploadPersonal
          id="avatar"
          mediatype="cutting"
          rectangle=""
          proportion={16 / 16}
          value={formik.values.avatar}
          edit={userData?.avatar}
          onChange={(v) => {
            formik.setFieldValue('avatar', v);
          }}
        />
        {formik.errors.avatar && formik.touched.avatar ? (
          <div style={{ color: 'red' }}>{formik.errors.avatar}</div>
        ) : null}
        <label htmlFor="name">
          {' '}
          <EditFormTitle text={t('ProfileEdit.username')} />
          <EditFromSubTitle text={t('ProfileEdit.usernameRule')} />
        </label>
        <FormInput id="name" value={formik.values.name} onChange={formik.handleChange} />
        {formik.errors.name && formik.touched.name ? (
          <div style={{ color: 'red' }}>{formik.errors.name}</div>
        ) : null}
        <label htmlFor="email">
          {' '}
          <EditFormTitle text={t('ProfileEdit.emai')} />
          <EditFromSubTitle text={t('ProfileEdit.emaiRule')} />
        </label>
        <FormInput id="email" value={formik.values.email} onChange={formik.handleChange} />
        {formik.errors.email && formik.touched.email ? (
          <div style={{ color: 'red' }}>{formik.errors.email}</div>
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
        <label htmlFor="featured_image">
          {' '}
          <EditFormTitle text={t('ProfileEdit.featuredImage')} />
          <EditFromSubTitle text={t('ProfileEdit.featuredImageRule')} />
        </label>
        <UploadPersonal
          id="featured_image"
          mediatype="cutting"
          rectangle="600px"
          proportion={1440 / 280}
          value={formik.values.featured_image}
          edit={userData?.featured_image}
          onChange={(v) => {
            formik.setFieldValue('featured_image', v);
          }}
        />
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
