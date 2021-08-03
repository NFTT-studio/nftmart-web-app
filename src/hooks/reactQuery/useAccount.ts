import { useQuery } from 'react-query';
import fetchAccount from '../../api/fetchAccount';
import { QUERY_KEYS } from '../../constants';

export default (address: string) => useQuery(
  QUERY_KEYS.NFT + address, () => fetchAccount(address),
  {
    placeholderData: {
      name: '',
      address: '',
      balance: {
        balance: '',
        bonded: '',
        feeFrozen: '',
        free: '',
        locked: '',
        miscFrozen: '',
        reserved: '',
        transferrable: '',
      },
      ownerNftscount: 0,
      createdNftCount: 0,
      createdClassCount: 0,
    },
  },
);
