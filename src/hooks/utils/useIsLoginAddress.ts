import { useAppSelector } from '../redux';

export default (address: string) => {
  const chainState = useAppSelector((state) => state.chain);
  const { account } = chainState;
  return account && account.address === address;
};
