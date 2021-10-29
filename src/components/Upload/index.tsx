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
import { create } from 'ipfs-http-client';
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

interface INavProps {
  imgUrl: string;
  name: string;
  uploadHandle: any;
  proportion: any;
}

const CropperCop: React.FC<INavProps> = (props) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropper, setCropper] = useState<any>();
  const { imgUrl, proportion } = props;

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
  ...rest
}) => {
  const toast = useToast();
  const [fileType, setFileType] = useState('');
  const [value, setValue] = useState(valueFromProp?.url || '');
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
    if (REACT_APP_PINATA_ENABLE === 'true') {
      setLoadingStatus(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const owFormData = new FormData();
      owFormData.append('file-0', files[0]);

      // const result = await fetch(PINATA_POST_SERVER, {
      //   method: 'POST',

      //   headers: {
      //     pinata_api_key: REACT_APP_PINATA_API_KEY!,
      //     pinata_secret_api_key: REACT_APP_PINATA_API_SECRET_KEY!,
      //   },

      //   body: formData,

      // });

      const result = await axios.post(PINATA_POST_SERVER, formData, {
        headers: {
          pinata_api_key: REACT_APP_PINATA_API_KEY!,
          pinata_secret_api_key: REACT_APP_PINATA_API_SECRET_KEY!,
        },
        onUploadProgress: (progress) => {
          // 格式化成百分数
          setProgresses(Math.floor((progress.loaded / progress.total) * 100));
        },
      });
      axios.post(UPLOAD_OWN_SERVER, owFormData);

      const responseData = await result;
      setValue(responseData.data.IpfsHash);
      setShowCrop(false);
      setLoadingStatus(false);
      setProgresses(0);
      return;
    }

    const ipfs = create({ url: IPFS_POST_SERVER });
    if (files.length === 0) {
      return;
    }
    try {
      setLoadingStatus(true);
      const added = await ipfs.add(files[0], {
        progress: (arg: any) => arg,
      });
      // console.log(added.cid.toString(), '=============');
      setValue(added.cid.toString());
      setLoadingStatus(false);
      setShowCrop(false);
    } catch (err) {
      setLoadingStatus(false);
    }
    setStateCrop(false);
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
            <ToastBody title={t('common.imgFiletype')} message="" type="warning" />
          ),
        });
        setLoadingStatus(false);
        return;
      }
      // if (fileTypes !== 'png' && fileTypes !== 'jpg' && fileTypes !== 'gif' && fileTypes !== 'jpeg') {
      //   toast(<ToastBody title={t('createUploadFiletype')} message="" type="warning" />);
      //   setLoadingStatus(false);
      //   return;
      // }
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
                  <Image w="350px" h="auto" m="16px 0" src={`${PINATA_SERVER}${value}`} />
                )
                : (
                  videoType.indexOf(fileType) > -1
                    ? (
                      <Box maxWidth="420px">
                        <Player width="100%">
                          <source style={{ height: 'auto' }} src={`${PINATA_SERVER}${value}`} />
                        </Player>
                      </Box>
                    )
                    : audioType.indexOf(fileType) > -1 ? (
                      <Box maxWidth="420px">
                        <Player width="100%">
                          <source style={{ height: 'auto' }} src={`${PINATA_SERVER}${value}`} />
                        </Player>
                      </Box>
                    )
                      : (
                        <Image w="350px" h="auto" m="16px 0" src={`${PINATA_SERVER}${value}`} />
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
                <CropperCop imgUrl={fileUrl} uploadHandle={saveToIpfs} name={imgName} proportion={proportion} />
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
