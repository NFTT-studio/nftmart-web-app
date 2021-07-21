/* eslint-disable react/no-children-prop */
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  useFormik,
  FormikProps,
} from 'formik';

import {
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';
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

const CreateCollection: FC = () => {
  // TODO: whitelist validate
  const { t } = useTranslation();
  const toast = useToast();

  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  const [Submitting, setSubmitting] = useState(false);

  const create = useCallback((formValue, cb) => {
    createClass({
      address: account!.address,
      metadata: {
        logoUrl: formValue.logoUrl,
        featuredUrl: formValue.featuredUrl,
        name: formValue.name,
        stub: formValue.stub,
        description: formValue.description,
      },
      cb,
    });
  }, []);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Create.Required')),
    name: Yup.string()
      .max(50, t('Create.nameRule'))
      .required(t('Create.Required')),
    stub: Yup.string().max(50, t('Create.urlRule')),
    description: Yup.string().max(1000, t('Create.descriptionRule')),
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
      setSubmitting(true);
      console.log(values);
      create(values, {
        success: (err: any) => {
          if (err.dispatchError) {
            toast({
              title: 'error',
              status: 'error',
              position: 'top',
              duration: 3000,
              description: t('create.create.error'),
            });
          } else {
            toast({
              title: 'success',
              status: 'success',
              position: 'top',
              duration: 3000,
            });
          }
          setSubmitting(false);
          formActions.resetForm();
        },
        error: (err: any) => {
          toast({
            title: 'error',
            status: 'error',
            position: 'top',
            duration: 3000,
            description: err,
          });
          setSubmitting(false);
          formActions.resetForm();
        },
      });
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
          <EditFormTitle text={t('Create.logo')} />
          <EditFromSubTitle text={t('Create.logoRule')} />
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
          <EditFormTitle text={t('Create.featured')} />
          <EditFromSubTitle text={t('Create.featuredRule')} />
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
          <EditFromSubTitle
            text={t('Create.urlRule')}
          />
        </label>
        <LeftAddonInput id="stub" value={formik.values.stub} onChange={formik.handleChange} />
        {formik.errors.stub && formik.touched.stub ? (
          <div style={{ color: 'red' }}>{formik.errors.stub}</div>
        ) : null}
        <label htmlFor="description">
          {' '}
          <EditFormTitle text={t('Create.description')} />
          <EditFromSubTitle text={t('Create.descriptionRule')} />
        </label>
        <FromTextarea id="description" onChange={formik.handleChange} value={formik.values.description} />
        {formik.errors.description && formik.touched.description ? (
          <div style={{ color: 'red' }}>{formik.errors.description}</div>
        ) : null}
        <Flex
          w="600px"
          justifyContent="center"
        >
          <SubmitButton text={t('Create.submit')} isSubmitting={Submitting} />
        </Flex>
      </form>
      <LoginDetector />
    </Flex>
  );
};

export default CreateCollection;
