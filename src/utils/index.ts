export const redirectConnect = (callbackUrl = '', history?: History<unknown>) => {
  // toast({
  //   desc: t('account.not.detected'),
  //   status: 'waring',
  // });
  setTimeout(() => {
    history.push(`/connect?callbackUrl=${callbackUrl}`);
  }, 2000);
};
