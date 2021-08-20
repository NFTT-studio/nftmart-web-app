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
import LoginDetector from '../../components/LoginDetector';
import { createClass } from '../../polkaSDK/api/createClass';
import { useAppSelector } from '../../hooks/redux';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';
import SetCategory from './SetCategory';

import {
  IconDel,
  WEBSITE,
  DISCORD,
  TWITTER,
  IconIns,
  medium,
  telegram,
} from '../../assets/images';

const CreateCollection: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);

  const { account, whiteList } = chainState;
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
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
  const remove = (l) => {
    const index = categories.indexOf(l);
    if (index > -1) {
      const newcategories:never[] = [];
      const arr = newcategories.concat(categories);
      arr.splice(index, 1);
      setCategories(arr);
    }
  };

  const create = useCallback((formValue, formActions) => {
    createClass({
      address: account!.address,
      metadata: {
        logoUrl: formValue.logoUrl,
        featuredUrl: formValue.featuredUrl,
        name: formValue.name,
        stub: formValue.stub,
        description: formValue.description,
        links: {
          website: formValue.website,
          discord: formValue.discord,
          twitter: formValue.twitter,
          ins: formValue.ins,
          medium: formValue.medium,
          telegram: formValue.telegram,
        },
      },
      royaltyRate: Number(formValue.royalties) / 100,
      cate: formValue.cate,
      cb: {
        success: (result) => {
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
        error: (error) => {
          toast(<ToastBody title="Error" message={error} type="error" />);
          setIsSubmitting(false);
          formActions.resetForm();
        },
      },
    });
  }, [account, history, t]);

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
      featuredUrl: '',
      name: '',
      stub: '',
      description: '',
      royalties: 0,
      cate: '',
      website: '',
      discord: '',
      twitter: '',
      ins: '',
      medium: '',
      telegram: '',
    },
    onSubmit: (values, formActions) => {
      setIsSubmitting(true);
      create(values, formActions);
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
          onChange={(v) => {
            formik.values.logoUrl = v;
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
          id="discord"
          value={formik.values.discord}
          onChange={formik.handleChange}
          position=""
          placeholder="https://discard.gg/"
          url={(
            <Image
              w="22px"
              h="22px"
              src={DISCORD.default}
            />
)}
        />
        <LeftImgonInput
          id="twitter"
          position=""
          value={formik.values.twitter}
          onChange={formik.handleChange}
          placeholder="@"
          url={(
            <Image
              w="22px"
              h="22px"
              src={TWITTER.default}
            />
)}
        />
        <LeftImgonInput
          id="ins"
          position=""
          value={formik.values.ins}
          onChange={formik.handleChange}
          placeholder="@"
          url={(
            <Image
              w="22px"
              h="22px"
              src={IconIns.default}
            />
)}
        />
        <LeftImgonInput
          id="medium"
          position=""
          value={formik.values.medium}
          onChange={formik.handleChange}
          placeholder="@"
          url={(
            <Image
              w="22px"
              h="22px"
              src={medium.default}
            />
)}
        />
        <LeftImgonInput
          id="telegram"
          position="bottom"
          value={formik.values.telegram}
          onChange={formik.handleChange}
          placeholder="https://t.me/"
          url={(
            <Image
              w="22px"
              h="22px"
              src={telegram.default}
            />
)}
        />
        {formik.errors.stub && formik.touched.stub ? (
          <div style={{ color: 'red' }}>{formik.errors.stub}</div>
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
              {t('Collection.royalties')}
            </Text>
            <Box
              width="349px"
              mt="8px"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#999999"
              lineHeight="16px"
              display="flex"
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
        <label htmlFor="categories">
          {' '}
          <EditFormTitle text={t('Collection.category')} />
          <EditFromSubTitle
            text={t('Collection.categoryRule')}
          />
        </label>
        <Flex w="600px" mt="30px">
          {categories.map((item) => (
            <Flex
              key={item.name}
              p="0 20px"
              height="40px"
              borderRadius="4px"
              border="1px solid #000000"
              fontSize="14px"
              fontFamily="TTHoves-Regular, TTHoves"
              fontWeight="400"
              color="#000000"
              lineHeight="14px"
              justifyContent="center"
              alignItems="center"
              mr="10px"
            >
              {item.name}
              <Image
                ml="10px"
                w="14px"
                h="14px"
                src={IconDel.default}
                onClick={() => remove(item)}
              />
            </Flex>
          ))}
          <SetCategory
            categories={categories}
            setCategories={setCategories}
            onChange={() => {
              const resultArr: any[] = [];
              // eslint-disable-next-line array-callback-return
              categories.map((item, index) => {
                resultArr.splice(index, 0, item.id);
              });
              formik.values.cate = resultArr.toString();
            }}
          />
        </Flex>
        {formik.errors.cate && formik.touched.cate ? (
          <div style={{ color: 'red' }}>{formik.errors.cate}</div>
        ) : null}
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
      <LoginDetector />
    </Flex>
  );
};

export default CreateCollection;
