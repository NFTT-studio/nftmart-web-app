import { useAppSelector } from '../redux';

export default (address: string | undefined) => {
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  if (account && account.address === address) {
    return true;
  }
  return false;
};
