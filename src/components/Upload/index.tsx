/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FC, useState, useCallback, useEffect, useRef, SetStateAction, Dispatch,
} from 'react';
import {
  Input,
  Image,
  Box,
  Text,
  FormLabel,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  useToast,
} from '@chakra-ui/react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
// 1
import { create } from 'ipfs-http-client';
// 2
// import { create } from 'ipfs';
import ReactAudioPlayer from 'react-audio-player';
import {
  Player,
} from 'video-react';
// eslint-disable-next-line import/no-unresolved
import '../../../node_modules/video-react/dist/video-react.css';

import {
  MAX_FILE_SIZE,
  Colors,
  PINATA_POST_SERVER,
  UPLOAD_OWN_SERVER,
  IPFS_POST_SERVER,
  PINATA_SERVER,
} from '../../constants';
import { t } from '../../i18n';
import {
  IconUpload,
} from '../../assets/images';
import MyToast, { ToastBody } from '../MyToast';

const COS = require('cos-js-sdk-v5');

const cos = new COS({
  getAuthorization: (options, callback) => {
    axios({
      url: 'https://test-cache.nftmart.io/api/accounts/cos/sts',
      method: 'get',
    }).then((data) => {
      const credentials = data.data && data.data.credentials;
      if (!data || !credentials) return console.error(data);
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        ExpiredTime: data.data.expiredTime,
      });
    });
  },
});

let ipfs;

interface INavProps {
  imgUrl: string;
  name: string;
  uploadHandle: any;
  proportion: any;
  setStateCrop:React.Dispatch<React.SetStateAction<boolean>>,
}

const CropperCop: React.FC<INavProps> = (props) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<any>();
  const { imgUrl, proportion, setStateCrop } = props;

  // 将base64转换为blob
  const dataURLtoBlob = (dataurl: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i <= n; i += 1) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  const getCropData = () => {
    if (typeof cropper !== 'undefined' && cropper.getCroppedCanvas()) {
      setStateCrop(true);
      const imgData = cropper.getCroppedCanvas().toDataURL('image/jpeg');
      const cropBlob = dataURLtoBlob(imgData);
      const cropFile = new File([cropBlob], props.name);
      props.uploadHandle([cropFile]);
    }
  };

  return (
    <Box>
      <Cropper
        src={imgUrl}
        style={{ height: 500, width: '100%' }}
        // Cropper.js options
        guides={false}
        viewMode={2}
        // crop={onCrop}
        aspectRatio={proportion}
        ref={cropperRef}
        autoCropArea={1}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
      <Text
        fontSize="14px"
        lineHeight="47px"
        cursor="pointer"
        color={Colors.Success}
        onClick={getCropData}
      >
        {t('Collection.confirmClipping')}
      </Text>
    </Box>
  );
};

const {
  REACT_APP_PINATA_API_KEY,
  REACT_APP_PINATA_API_SECRET_KEY,
  REACT_APP_PINATA_ENABLE,
} = process.env;

export interface UploadProps {
  boxProps?: Record<string, unknown>;
  id: string;
  value?: any;
  onChange?: (cid: string, b: string,) => any;
  mediatype: string;
  rectangle: string;
  proportion: number;
  setStateCrop:React.Dispatch<React.SetStateAction<boolean>>,
  fileClass: string;
  fileName: string;
  url: string;
}

const Upload: FC<UploadProps> = ({
  id,
  value: valueFromProp,
  onChange,
  boxProps,
  mediatype,
  rectangle,
  proportion,
  setStateCrop,
  fileClass,
  fileName,
  url,
  ...rest
}) => {
  const toast = useToast();
  const [fileType, setFileType] = useState(fileName || '');
  const [value, setValue] = useState(url || '');
  const [isLoading, setLoadingStatus] = useState(false);
  const [imgName, setImgName] = useState('');
  const [file, setFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [progresses, setProgresses] = useState(0);

  const pictureType = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const videoType = ['mp4', 'webm'];
  const audioType = ['mp3', 'wav', 'ogg'];

  const saveToIpfs = useCallback(async (files: any[]) => {
    setStateCrop(false);
    try {
      if (!ipfs) {
        console.info('ipfs init');
        //1:
        const auth = Buffer.from('21zPVzYCCiZdv8HErHmd7R6p9tO:fcddc1ceea96541ba987dbae2a05f0ff').toString('base64');
        ipfs = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: { authorization: `Basic ${auth}` },
        });
        //2:
        // ipfs = await create();
        // const ipfsid = await ipfs.id();
        // console.info(ipfsid);
        // end
      }
      if (files.length === 0) {
        return;
      }
      const addOptions = {
        onlyHash: true,
        // progress: (arg: any) => {
        //   setProgresses(1);
        // },
      };
      setLoadingStatus(true);
      // ipfs.
      const added = await ipfs.add(files[0], addOptions);
      console.log(added.cid.toString());
      await cos.putObject(
        {
          Bucket: 'nft-1257035533',
          Region: 'ap-hongkong',
          Key: `/${fileClass}/${added.cid.toString()}`,
          StorageClass: 'STANDARD',
          Body: files[0],
          onProgress(progressData) {
            setProgresses(Math.floor((progressData.percent) * 100));
          },
        },
        (err: any, data: any) => {
          if (err) {
            toast({
              position: 'top',
              render: () => (
                <ToastBody title="error" message="error" type="error" />
              ),
            });
            return;
          }
          setValue(added.cid.toString());
          setLoadingStatus(false);
          setShowCrop(false);
        },
      );
    } catch (e) {
      console.info(e);
      toast({
        position: 'top',
        render: () => (
          <ToastBody title="error" message="error" type="error" />
        ),
      });
      setFile(null);
      setValue('');
      setLoadingStatus(false);
      setShowCrop(false);
    }
  }, []);

  const captureFile = useCallback((event: any) => {
    if (event.target.files.length > 0) {
      event.stopPropagation();
      event.preventDefault();
      const currentFile = event.target.files[0];
      const fileTypes = currentFile.name
        .substring(currentFile.name.lastIndexOf('.') + 1)
        .toLowerCase();
      if (pictureType.indexOf(fileTypes) === -1 && videoType.indexOf(fileTypes) === -1 && audioType.indexOf(fileTypes) === -1) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title={t('common.imgFiletype')} message="" type="warning" />
          ),
        });
        setLoadingStatus(false);
        return;
      }
      if ((mediatype === 'img' || mediatype === 'cutting') && pictureType.indexOf(fileTypes) === -1) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="warning" message={t('common.imgFiletype')} type="warning" />
          ),
        });
        setLoadingStatus(false);
        return;
      }
      if (pictureType.indexOf(fileTypes) !== -1 && currentFile.size >= 1024 * 1024 * 32) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title="warning" message={t('common.imgFilesize')} type="warning" />
          ),
        });
        setLoadingStatus(false);
        return;
      }
      if (currentFile.size >= MAX_FILE_SIZE) {
        toast({
          position: 'top',
          render: () => (
            <ToastBody title={t('createUploadOverflow')} message="" type="warning" />
          ),
        });
        setLoadingStatus(false);
        return;
      }
      setImgName(currentFile.name);
      if (mediatype === 'cutting') {
        setFileType(fileTypes);
        setValue('');
        setFile(currentFile);
        setShowCrop(true);
        setStateCrop(true);
      } else {
        setFileType(fileTypes);
        setFile(currentFile);
        setValue('');
        setShowCrop(false);
        saveToIpfs(event.target.files);
        setShowCrop(false);
      }
    }
  }, [mediatype, saveToIpfs]);

  const cropImage = (e: any) => {
    if (e) {
      e.stopPropagation();
    }
    setShowCrop(true);
  };

  // useEffect(() => {
  //   if (valueFromProp.url !== !!valueFromProp.url) {
  //     setValue(valueFromProp.url as string);
  //   }
  // }, []);

  useEffect(() => {
    if (onChange) onChange(value, fileType);
  }, [value]);

  useEffect(() => {
    if (!file) {
      setShowCrop(false);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const dataURL = e.target.result;
      setFileUrl(dataURL);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const txtUpload = (
    <>
      {rectangle === ''
        ? (
          <Flex
            width="120px"
            height="120px"
            background="#FFFFFF"
            borderRadius="4px"
            border="1px solid #999999"
            cursor="pointer"
            borderStyle="dashed"
            justifyContent="center"
            alignItems="center"
          >
            <Image w="54px" h="54px" src={IconUpload.default} />
          </Flex>
        )
        : (
          <Flex
            width={rectangle}
            height="133px"
            background="#FFFFFF"
            borderRadius="4px"
            border="1px solid #999999"
            cursor="pointer"
            borderStyle="dashed"
            justifyContent="center"
            alignItems="center"
          >
            <Image w="54px" h="54px" src={IconUpload.default} />
          </Flex>
        )}

    </>
    // <Text fontSize="14px" lineHeight="47px"  color={Colors.Success}>
    //   {t('createUpload')}
    // </Text>
  );

  const imgWrap = (
    <Box>
      {isLoading ? (
        <CircularProgress value={progresses} isIndeterminate color="green.400">
          <CircularProgressLabel>
            {progresses}
            %
          </CircularProgressLabel>
        </CircularProgress>
      ) : (
        <Box>
          {value ? (
            <>
              {pictureType.indexOf(fileType) > -1
                ? (
                  <Image w="350px" h="auto" m="16px 0" src={`${PINATA_SERVER}${fileClass}/${value}`} />
                )
                : (
                  videoType.indexOf(fileType) > -1
                    ? (
                      <Box maxWidth="420px">
                        <Player width="100%">
                          <source style={{ height: 'auto' }} src={`${PINATA_SERVER}${fileClass}/${value}`} />
                        </Player>
                      </Box>
                    )
                    : audioType.indexOf(fileType) > -1 ? (
                      <Box maxWidth="420px">
                        <ReactAudioPlayer
                          src={`${PINATA_SERVER}${fileClass}/${value}`}
                          controls
                        />
                        {/* <Player width="100%">
                          <source style={{ height: 'auto' }} src={`${PINATA_SERVER}${fileClass}/${value}`} />
                        </Player> */}
                      </Box>
                    )
                      : (
                        <Image
                          w="350px"
                          h="auto"
                          m="16px 0"
                          src={`${PINATA_SERVER}${fileClass}/${value}!preview`}
                        />
                      )
                )}

              <FormLabel htmlFor={id}>
                <Text
                  fontSize="14px"
                  lineHeight="47px"
                  cursor="pointer"
                  color={Colors.Success}
                  onClick={() => setFile(null)}
                >
                  {t('Collection.changeImage')}
                </Text>
              </FormLabel>
              <Input
                id={id}
                display="none"
                type="file"
                onChange={captureFile}
                {...rest}
              />
            </>
          ) : (
            <Box>
              {file ? (
                <CropperCop imgUrl={fileUrl} uploadHandle={saveToIpfs} name={imgName} proportion={proportion} setStateCrop={setStateCrop} />
              ) : (
                txtUpload
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  // const operateBtn = (
  //   <Box>
  //     {value && !showCrop ? (
  //       <Text
  //         fontSize="14px"
  //         lineHeight="47px"
  //         cursor="pointer"
  //         color={Colors.success}
  //         onClick={cropImage}
  //       >
  //         {t('createCrop')}
  //       </Text>
  //     ) : (
  //       ''
  //     )}
  //   </Box>
  // );

  return (
    <Box>
      <Box {...boxProps}>
        <FormLabel htmlFor={id}>
          {/* {txtUpload} */}
          {!showCrop ? imgWrap : ''}
        </FormLabel>
        <Input
          id={id}
          display="none"
          type="file"
          disabled={value}
          onChange={captureFile}
          {...rest}
        />
        {/* 切图编辑时不触发input点击事件 */}
        {showCrop ? imgWrap : ''}
      </Box>
      <MyToast isCloseable />
    </Box>
  );
};

export default Upload;
