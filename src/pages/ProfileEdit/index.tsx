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
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import UploadPersonal from '../../components/UploadPersonal';
import EditFormTitle from '../../components/EditFormTitle';
import EditFromSubTitle from '../../components/EditFromSubTitle';
import FormInput from '../../components/FormInput';
import SubmitButton from '../../components/SubmitButton';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';
import { useAppSelector } from '../../hooks/redux';
import useUser from '../../hooks/reactQuery/useUser';
import { CACHE_SERVER_URL } from '../../constants';
import MainContainer from '../../layout/MainContainer';

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const [stateCrop, setStateCrop] = useState(false);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: userData } = useUser(account?.address);

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
      if (stateCrop) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="warning" message={t('common.cuttingConfirmed')} type="warning" />
          ),
        });
        return;
      }
      setIsSubmitting(false);
      console.log(values);

      setIsSubmitting(true);
      const params = new URLSearchParams();
      params.append('id', account?.address || '');
      params.append('name', values.name);
      params.append('avatar', values.avatar || '');
      params.append('featured_image', values.featured_image || '');
      params.append('twitter', values.twitter);
      params.append('email', values.email || userData?.email);

      // const formData = new FormData();
      // formData.append('id', account?.address || '');
      // formData.append('name', values.name);
      // formData.append('avatar', values.avatar || '');
      // formData.append('featured_image', values.featured_image || '');
      // formData.append('twitter', values.twitter);
      // formData.append('email', values.email || userData?.email);
      await axios.post(`${CACHE_SERVER_URL}accounts`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((res) => {
        setIsSubmitting(false);
        history.push(`/account/${account?.address}/wallet`);
      });
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={`${t('ProfileEdit.title')}|${t('Home.title')}`}>
      <Flex
        w="600px"
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
            setStateCrop={setStateCrop}
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
            proportion={1400 / 400}
            value={formik.values.featured_image}
            edit={userData?.featured_image}
            setStateCrop={setStateCrop}
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
    </MainContainer>
  );
};

export default CreateCollection;
