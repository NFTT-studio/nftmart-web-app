/* eslint-disable max-len */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-children-prop */
import React, {
  useState, useEffect, useCallback, ChangeEventHandler,
} from 'react';
import {
  useHistory, RouteComponentProps, Link as RouterLink,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import * as Yup from 'yup';
import {
  useFormik,
} from 'formik';
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
  useToast,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import { trim } from 'lodash';
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
import useNft from '../../hooks/reactQuery/useNft';

import {
  PINATA_SERVER,
} from '../../constants';
import {
  IconLeft,
} from '../../assets/images';
import { mintNft } from '../../polkaSDK/api/mintNft';
import { updateToken } from '../../polkaSDK/api/updateToken';
import MyModal from '../../components/MyModal';
import MyToast, { ToastBody } from '../../components/MyToast';

const CreateNft = ({ match }: RouteComponentProps<{ collectionId: string }>) => {
  function GetQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = decodeURI(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  const status = GetQueryString('collectionId');
  const modifyId = GetQueryString('modifyId');
  const [propertiesArr, setPropertiesArr] = useState([{ key: '', value: '' }]);

  const tokenId = modifyId?.split('-')[1];
  function number2PerU16(x) {
    return Math.round((x / 65535.0) * 100);
  }
  const { t } = useTranslation();
  const toast = useToast();
  const history = useHistory();
  const chainState = useAppSelector((state) => state.chain);
  const collectionId = match.params.collectionId || status;
  const { account, whiteList } = chainState;
  const [isShowModal, setIsShowModal] = useState(false);
  const [preview, setIsPreview] = useState(false);
  const [royaltiesSl, setroyaltiesSl] = useState(false);
  const excludeControls = ['media'];
  const title2 = {
    name: 'title2',
    keyCommand: 'title2',
    icon: (
      <svg width="12" height="12" viewBox="0 0 512 512">
        <path fill="currentColor" d="M496 80V48c0-8.837-7.163-16-16-16H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.621v128H154.379V96H192c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.275v320H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.621V288H357.62v128H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.275V96H480c8.837 0 16-7.163 16-16z" />
      </svg>
    ),
    execute: (editor, selection, position) => {
      const value = selection ? `## ${selection}` : '## ';
      editor.replaceSelection(value);
      position.ch = selection ? position.ch : position.ch + 3;
      editor.setCursor(position.line, position.ch);
      editor.focus();
    },
  };
  const onCloseModal = () => {
    setIsShowModal(false);
    history.push('/');
  };
  useEffect(() => {
    if (!account || whiteList?.indexOf(account?.address) < 0) {
      setIsShowModal(true);
    }
  }, [account, whiteList.length !== 0]);
  const { data: collectionsData } = useCollectionsSinger(collectionId);
  const { data: nftData, isLoading: nftDataIsLoading, refetch: refetchNftData } = useNft(modifyId);
  const [markdown, setMarkdown] = useState(nftData?.nftInfo?.metadata?.description);
  const onChange = useCallback((value: string) => {
    setMarkdown(value);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateCrop, setStateCrop] = useState(false);

  const schema = Yup.object().shape({
    logoUrl: Yup.string().required(t('Create.required')),
    previewUrl: preview ? Yup.string().required(t('Create.required')) : Yup.string(),
    name: Yup.string()
      .max(50, t('Create.nameRule'))
      .required(t('Create.required')),
    stub: Yup.string().max(200, t('Create.urlRule')),
    description: Yup.string().max(1000, t('Create.descriptionRule')),
    royalties: Yup.number().max(20, t('Collection.royaltiesSchema')).min(0, t('Collection.royaltiesSchema')),
  });
  useEffect(() => {
    if (collectionsData?.collection?.royalty_rate) {
      setroyaltiesSl(true);
    }
  }, [collectionsData]);
  useEffect(() => {
    if (nftData?.nftInfo?.metadata?.properties?.length > 0) {
      setPropertiesArr(nftData?.nftInfo?.metadata?.properties);
    }
  }, [nftData?.nftInfo?.metadata?.properties?.length]);
  const addMore = () => {
    const arr = propertiesArr.concat({ key: '', value: '' });
    setPropertiesArr(arr);
  };
  const handleInputKey: ChangeEventHandler<HTMLInputElement> = (item) => {
    propertiesArr[Number(item.target.id)].key = item.target.value;
    setPropertiesArr(propertiesArr);
  };
  const handleInputValue: ChangeEventHandler<HTMLInputElement> = (item) => {
    propertiesArr[Number(item.target.id)].value = item.target.value;
    setPropertiesArr(propertiesArr);
  };

  const mint = useCallback(async (formValue, propertiesLet, description, cb) => {
    const normalizedFormData = {
      address: account?.address,
      metadata: {
        logoUrl: formValue.logoUrl,
        previewUrl: formValue.previewUrl,
        fileType: formValue.fileType,
        name: formValue.name,
        stub: formValue.stub ? `https://${formValue.stub}` : null,
        description,
        properties: propertiesLet,
      },
      classId: collectionId,
      quantity: 1,
      royaltyRate: formValue.isRoyalties ? (Number(formValue.royalties) / 100) : 0,
      cb,
    };
    mintNft(normalizedFormData);
  }, [account?.address, collectionId]);
  const update = useCallback(async (formValue, propertiesLet, description, cb) => {
    const normalizedFormData = {
      address: account?.address,
      metadata: {
        logoUrl: formValue.logoUrl,
        previewUrl: formValue.previewUrl,
        fileType: formValue.fileType,
        name: formValue.name,
        stub: formValue.stub ? `https://${formValue.stub}` : null,
        description,
        properties: propertiesLet,
      },
      classId: collectionId,
      tokenId,
      quantity: 1,
      royaltyRate: formValue.isRoyalties ? (Number(formValue.royalties) / 100) : 0,
      cb,
    };
    updateToken(normalizedFormData);
  }, [account?.address, collectionId]);

  const formik = useFormik({
    initialValues: {
      logoUrl: modifyId ? nftData?.nftInfo?.metadata?.logoUrl : '',
      previewUrl: modifyId ? nftData?.nftInfo?.metadata?.previewUrl : '',
      name: modifyId ? nftData?.nftInfo?.metadata?.name : '',
      stub: modifyId ? trim(nftData?.nftInfo?.metadata?.stub?.replace(/https:\/\//i, '')) : '',
      description: modifyId ? nftData?.nftInfo?.metadata?.description : '',
      royalties: modifyId ? number2PerU16(nftData?.nftInfo?.royalty_rate || 0) : number2PerU16(collectionsData?.collection?.royalty_rate || 0),
      fileType: modifyId ? nftData?.nftInfo?.metadata?.fileType : '',
      isRoyalties: !!collectionsData?.collection?.royalty_rate,
    },
    onSubmit: (formValue, formAction) => {
      if (stateCrop) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="warning" message={t('common.cuttingConfirmed')} type="warning" />
          ),
        });
        return;
      }
      setIsSubmitting(true);
      const propertiesLet = propertiesArr.filter((item) => item.key !== '' && item.value !== '');
      const description = markdown;
      if (modifyId) {
        update(formValue, propertiesLet, description, {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            formAction.resetForm();
            setTimeout(() => {
              setIsSubmitting(false);
              history.push(`/items/${nftData?.nftInfo?.id}-${encodeURIComponent(formValue.name)}`);
            }, 3000);
          },
          error: (error: string) => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Error" message={error} type="error" />
              ),
            });
            setIsSubmitting(false);
          },
        });
      } else {
        mint(formValue, propertiesLet, description, {
          success: () => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Success" message={t('common.success')} type="success" />
              ),
            });
            formAction.resetForm();
            setTimeout(() => {
              setIsSubmitting(false);
              history.push(`/collection/${collectionId}-${encodeURIComponent(collectionsData?.collection?.metadata.name)}`);
            }, 3000);
          },
          error: (error: string) => {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="Error" message={error} type="error" />
              ),
            });
            setIsSubmitting(false);
          },
        });
      }
    },
    validationSchema: schema,
  });

  return (
    <MainContainer title={modifyId ? t('Update.modifyNFT') : t('Create.title')}>
      <Flex
        w="100%"
        h="80px"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link
          as={RouterLink}
          to={`/collection/${collectionId}-${encodeURIComponent(collectionsData?.collection?.metadata.name)}`}
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
              src={`${PINATA_SERVER}logo/${collectionsData?.collection?.metadata.logoUrl}`}
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
          {modifyId ? t('Update.modifyNFT') : t('Create.createCollection')}
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
            setStateCrop={setStateCrop}
            fileClass="nft"
            url={formik.values.logoUrl}
            fileName={nftData?.nftInfo?.metadata?.fileType}
            onChange={(v, b) => {
              formik.setFieldValue('logoUrl', v);
              formik.setFieldValue('fileType', b);
              if (b !== 'gif' && b !== 'png' && b !== 'jpg' && b !== '' && b !== 'jpeg') {
                setIsPreview(true);
              } else {
                setIsPreview(false);
                formik.setFieldValue('previewUrl', '');
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
                  url={formik.values.previewUrl}
                  fileName=""
                  setStateCrop={setStateCrop}
                  fileClass="nft"
                  onChange={(v, b) => {
                    formik.setFieldValue('previewUrl', v);
                  }}
                />
              </>
            ) : null}
          {formik.errors.previewUrl && formik.touched.previewUrl ? (
            <div style={{ color: 'red' }}>{formik.errors.previewUrl}</div>
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
          {formik.errors.stub && formik.touched.stub ? (
            <div style={{ color: 'red' }}>{formik.errors.stub}</div>
          ) : null}
          <label htmlFor="description">
            {' '}
            <EditFormTitle text={t('Create.description')} />
            <EditFromSubTitle text={t('Create.descriptionRule')} />
          </label>
          {/* <BraftEditor
            id="description"
            style={{
              border: '1px solid #E5E5E5',
              height: '300px',
            }}
            excludeControls={excludeControls}
            defaultValue={formik.values.description}
            value={editorState}
            onChange={handleChange}
          /> */}
          <SimpleMDE
            options={{
              spellChecker: false,
              toolbar: [
                'bold',
                'italic',
                'heading',
                '|',
                'quote',
                'code',
                'table',
                'horizontal-rule',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                '|',
                'preview',
                '|',
                'guide',
              ],
            }}
            value={markdown}
            onChange={onChange}
          />
          {/* <FromTextarea id="description" onChange={formik.handleChange} value={formik.values.description} /> */}
          {formik.errors.description && formik.touched.description ? (
            <div style={{ color: 'red' }}>{formik.errors.description}</div>
          ) : null}
          <Text
            marginTop="30px"
            fontSize="16px"
            fontFamily="TTHoves-Medium, TTHoves"
            fontWeight="500"
            color="#000000"
            lineHeight="18px"
          >
            Properties
          </Text>
          <Table
            marginTop="24px"
            borderRadius="4px"
            border="1px solid #E5E5E5"
          >
            <Thead>
              <Tr>
                <Th
                  width="50%"
                  textAlign="center"
                  borderRight="1px solid #E5E5E5"
                  background="#F4F4F4"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#000000"
                >
                  Name
                </Th>
                <Th
                  width="50%"
                  textAlign="center"
                  background="#F4F4F4"
                  fontFamily="TTHoves-Medium, TTHoves"
                  fontWeight="500"
                  color="#000000"
                >
                  Value
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from(propertiesArr)?.map((item, index) => (
                <Tr>
                  <Td
                    width="50%"
                    textAlign="center"
                    borderRight="1px solid #E5E5E5"
                  >
                    <Input
                      id={index.toString()}
                      fontSize="14px"
                      color="#000000"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      placeholder="property name"
                      defaultValue={item.key}
                      onChange={handleInputKey}
                    />
                  </Td>
                  <Td
                    width="50%"
                    textAlign="center"
                  >
                    <Input
                      id={index.toString()}
                      name={index.toString()}
                      fontSize="14px"
                      color="#000000"
                      fontFamily="TTHoves-Regular, TTHoves"
                      fontWeight="400"
                      placeholder="property value"
                      defaultValue={item.value}
                      onChange={handleInputValue}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Text
            ml="3px"
            height="16px"
            display="inline-block"
            color="#3D00FF"
            onClick={addMore}
            cursor="pointer"
          >
            Add  more
          </Text>
          <Flex
            w="100%"
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
                  formik.values.isRoyalties = !royaltiesSl;
                  setroyaltiesSl(!royaltiesSl);
                }}
                size="lg"
              />
              <InputGroup
                mt="10px"
                display={royaltiesSl ? 'flex' : 'none'}
                width="200px"
                background="#FFFFFF"
                borderRadius="4px"
                border="1px solid #E5E5E5"
                _focus={{
                  boxShadow: 'none',
                }}
              >
                {collectionsData?.collection
                  ? (
                    <Input
                      id="royalties"
                      name="royalties"
                      value={formik.values.royalties}
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
                  ) : ''}
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
          title={t('common.InTheWhitelist')}
          message={t('common.Certification')}
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
