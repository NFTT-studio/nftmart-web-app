/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { t } from '../i18n';

const toastStandalone = createStandaloneToast();

export type toastStatus = 'success' | 'info' | 'warning' | 'error' | undefined;

export const toast = ({
  title = 'Tips',
  description = '',
  status = 'success',
  duration = 9000,
  isClosable = true,
  position = 'bottom-right',
}: UseToastOptions) => {
  toastStandalone({
    position,
    title,
    description,
    status,
    duration,
    isClosable,
  });
};
export const txLog = (result: any, onSuccess = (res: any) => res) => {
  // toast({
  //   title: '',
  //   desc: t('Trx.broadcasting'),
  //   status: 'info',
  //   duration: 8000,
  // });
  // console.log(result.status, '=====');
  if (result.status.isInBlock) {
    toast({
      title: '',
      description: t('Trx.inblock'),
      status: 'info',
      duration: 8000,
    });
    // console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  } else if (result.status.isFinalized) {
    toast({
      title: '',
      description: t('Trx.finalize'),
      status: 'success',
      duration: 6000,
    });
    onSuccess(result);
    // console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
  } else if (result.status.isBroadcast) {
    toast({
      title: '',
      description: t('Trx.broadcasting'),
      status: 'info',
      duration: 10000,
    });
  } else if (result.status.isInvalid) {
    toast({
      title: 'error',
      description: t('Trx.failed'),
      status: 'info',
      duration: 5000,
    });
  }
};
