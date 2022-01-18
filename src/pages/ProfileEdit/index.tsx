/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable react/no-children-prop */
import React, {
  FC, useState, ChangeEventHandler, useEffect,
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
  Image,
  Text,
  Spinner,
  Center,
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
import LeftImgonInput from '../../components/LeftImgonInput';
import FromTextarea from '../../components/FromTextarea';
import LeftInput from './LeftInput';
import LeftInputDate from './LeftInputDate';
import useIsLoginAddress from '../../hooks/utils/useIsLoginAddress';

import {
  WEBSITE,
  TWITTER,
  IconIns,
} from '../../assets/images';

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const { account, whiteList } = chainState;
  const [stateCrop, setStateCrop] = useState(false);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventArr, setEventArr] = useState([{ Date: '', Subject: '', Link: '' }]);

  const handleInputDate = (item, id) => {
    eventArr[Number(id)].Date = item;
    setEventArr(eventArr);
  };
  const handleInputSubject: ChangeEventHandler<HTMLInputElement> = (item) => {
    eventArr[Number(item.target.id)].Subject = item.target.value;
    setEventArr(eventArr);
  };
  const handleInputLink: ChangeEventHandler<HTMLInputElement> = (item) => {
    eventArr[Number(item.target.id)].Link = item.target.value;
    setEventArr(eventArr);
  };

  const { data: userData, isLoading: userDataLoading, refetch: fetchUserData } = useUser(account?.address);

  const onCloseModal = () => {
    setIsShowModal(false);
    history.push('/');
  };
  const addMore = () => {
    const arr = eventArr.concat({ Date: '', Subject: '', Link: '' });
    setEventArr(arr);
  };

  useEffect(() => {
    if (account?.address) {
      fetchUserData();
    }
  }, [account?.address]);
  useEffect(() => {
    const arr = [];
    try {
      for (const i in JSON.parse(userData?.events)) {
        arr.push(JSON.parse(userData?.events)[i]);
      }
      if (arr.length > 0) {
        setEventArr(arr);
      }
    } catch (e) {
      console.log('');
    }
  }, [userData?.events]);

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
      name: userData?.name || '',
      avatar: userData?.avatar || '',
      featured_image: userData?.featured_image,
      twitter: userData?.twitter,
      email: userData?.email,
      website: userData?.website,
      discord: userData?.email,
      instagram: userData?.instagram,
      medium: userData?.email,
      telegram: userData?.email,
      summary: userData?.summary,
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
      const eventArrLet = JSON.stringify({ ...eventArr.filter((item) => item.Date !== '' && item.Subject !== '') });
      // console.log(eventArrLet);
      // return;
      const params = new URLSearchParams();
      params.append('id', account?.address || '');
      params.append('name', values.name);
      params.append('avatar', values.avatar || '');
      params.append('featured_image', values.featured_image || '');
      params.append('twitter', values.twitter || '');
      params.append('website', values.website || '');
      params.append('instagram', values.instagram || '');
      params.append('summary', values.summary || '');
      params.append('events', eventArrLet || userData?.events);
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
        history.push('/account/owned');
      });
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={`${t('ProfileEdit.title')}|${t('Home.title')}`}>
      {userDataLoading ? (
        <Center width="100%" height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
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
            {/* <label htmlFor="twitter">
              {' '}
              <EditFormTitle text={t('ProfileEdit.twitter')} />
              <EditFromSubTitle text={t('ProfileEdit.twitterRule')} />
            </label>
            <FormInput id="twitter" value={formik.values.twitter} onChange={formik.handleChange} /> */}
            {/* {formik.errors.twitter && formik.touched.twitter ? (
              <div style={{ color: 'red' }}>{formik.errors.twitter}</div>
            ) : null} */}
            {!(whiteList?.indexOf(account?.address) < 0)
              ? (
                <>
                  <label htmlFor="Links">
                    {' '}
                    <EditFormTitle text={t('Collection.links')} />
                  </label>
                  <Flex mt="24px" />
                  <LeftImgonInput
                    id="website"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    position="top"
                    placeholder="http://"
                    url={(
                      <Image
                        w="22px"
                        h="22px"
                        src={WEBSITE.default}
                      />
                    )}
                  />
                  <LeftImgonInput
                    id="twitter"
                    position=""
                    value={formik.values.twitter}
                    onChange={formik.handleChange}
                    placeholder="https://twitter.com/"
                    url={(
                      <Image
                        w="22px"
                        h="22px"
                        src={TWITTER.default}
                      />
                    )}
                  />
                  <LeftImgonInput
                    id="instagram"
                    position="bottom"
                    value={formik.values.instagram}
                    onChange={formik.handleChange}
                    placeholder="https://www.instagram.com/"
                    url={(
                      <Image
                        w="22px"
                        h="22px"
                        src={IconIns.default}
                      />
                    )}
                  />
                  <label htmlFor="summary">
                    {' '}
                    <EditFormTitle text={`*${t('ProfileEdit.Summary')}`} />
                    <EditFromSubTitle text={t('ProfileEdit.SummaryRule')} />
                  </label>
                  <FromTextarea id="summary" onChange={formik.handleChange} value={formik.values.summary} />
                  <label htmlFor="event">
                    {' '}
                    <EditFormTitle text={`*${t('ProfileEdit.Event')}`} />
                    <EditFromSubTitle text={t('ProfileEdit.EventRule')} />
                  </label>
                  { }
                  {Array.from(eventArr)?.map((item, index) => (
                    <>
                      <Flex mt="25px" />
                      {/* <LeftInput
                        id={index.toString()}
                        value={item.Date}
                        onChange={handleInputDate}
                        position="top"
                        url="Date"
                        urlOptional=""
                      /> */}
                      <LeftInputDate
                        id={index.toString()}
                        defaultValue={item.Date ? item.Date : ''}
                        onChange={handleInputDate}
                        position="top"
                        url={t('ProfileEdit.Date')}
                        urlOptional=""
                      />
                      <LeftInput
                        id={index.toString()}
                        value={item.Subject}
                        onChange={handleInputSubject}
                        position=""
                        url={t('ProfileEdit.Subject')}
                        urlOptional=""
                      />
                      <LeftInput
                        id={index.toString()}
                        value={item.Link}
                        onChange={handleInputLink}
                        position="bottom"
                        url={t('ProfileEdit.Link')}
                        urlOptional={t('ProfileEdit.Optional')}
                      />
                    </>
                  ))}
                  <Text
                    mt="25px"
                    ml="3px"
                    height="16px"
                    display="inline-block"
                    color="#6DD400"
                    fontSize="14px"
                    fontFamily="PingFangSC-Regular, PingFang SC"
                    fontWeight="400"
                    onClick={addMore}
                    cursor="pointer"
                  >
                    +
                    {t('ProfileEdit.Add')}
                  </Text>
                </>
              ) : ''}
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
      )}
    </MainContainer>
  );
};

export default CreateCollection;
