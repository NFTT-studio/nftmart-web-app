/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FC, useState, useCallback, useEffect, useRef,
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
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import {
  MAX_FILE_SIZE,
  Colors,
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
export interface UploadProps {
  boxProps?: Record<string, unknown>;
  id: string;
  value?: any;
  onChange?: (cid: any) => any;
  mediatype: string;
  rectangle: string;
  proportion: number;
}

const Upload: FC<UploadProps> = ({
  id,
  value: valueFromProp,
  onChange,
  boxProps,
  mediatype,
  rectangle,
  proportion,
  ...rest
}) => {
  const [value, setValue] = useState(valueFromProp?.url || '');
  const [isLoading, setLoadingStatus] = useState(false);
  const [imgName, setImgName] = useState('');
  const [file, setFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [progresses, setProgresses] = useState(0);
  const [fileValue, setFileValue] = useState(null);

  const saveToIpfs = useCallback(async (files: any[]) => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e: any) => {
      setValue(e.target.result);
      setFileValue(files[0]);
      setLoadingStatus(false);
      setShowCrop(false);
    };
  }, []);

  const captureFile = useCallback((event: any) => {
    if (event.target.files.length > 0) {
      event.stopPropagation();
      event.preventDefault();
      const currentFile = event.target.files[0];
      const fileType = currentFile.name
        .substring(currentFile.name.lastIndexOf('.') + 1)
        .toLowerCase();

      if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'gif' && fileType !== 'jpeg') {
        toast(<ToastBody title={t('createUploadFiletype')} message="" type="warning" />);
        setLoadingStatus(false);
        return;
      }
      if (currentFile.size >= MAX_FILE_SIZE) {
        toast(<ToastBody title={t('createUploadOverflow')} message="" type="warning" />);
        setLoadingStatus(false);
        return;
      }
      if (mediatype === 'cutting') {
        setValue('');
        setFile(currentFile);
        setShowCrop(true);
        setImgName(currentFile.name);
      } else {
        setValue('');
        setFile(currentFile);
        saveToIpfs(event.target.files);
        setImgName(currentFile.name);
      }
    }
  }, [mediatype, saveToIpfs]);

  useEffect(() => {
    if (onChange) onChange(fileValue);
  }, [fileValue]);

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
              <Image w="350px" h="auto" m="16px 0" src={`${value}`} />

              <FormLabel htmlFor="changeId">
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
                id="changeId"
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
  return (
    <Box>
      <Box {...boxProps}>
        <FormLabel htmlFor={id}>
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
