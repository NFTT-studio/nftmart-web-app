import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Box, Text, Divider } from '@chakra-ui/react';

import { encodeAddress } from '@polkadot/util-crypto';
import { SelectIcon } from '../../assets/icons';
import { Colors } from '../../constants';
import useAccount from '../../hooks/reactQuery/useAccount';
import { renderNmtNumberText } from '../Balance';

interface AccountProps {
  handleClick: (index: number) => Promise<void>;
  index: number;
  length: number;
  address: string;
  InjectedAccountList: InjectedAccountWithMeta[]
}

const Account = ({
  handleClick, index, length, address, InjectedAccountList,
}: AccountProps) => {
  const { data } = useAccount(address);
  return (
    <>
      {data && (
        <Box
          key={data.address}
          height="80px"
          padding="20px"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => handleClick(index)}
          cursor="pointer"
        >
          <Box display="inline-block">
            <Text fontWeight="medium">{InjectedAccountList[index].meta.name}</Text>
            {data.address ? <Text color={Colors.TextGray}>{encodeAddress(data.address, 12191)}</Text> : null}
          </Box>
          <Box
            display="inline-flex"
            alignItems="center"
            height="20px"
            fontSize="14px"
            fontFamily="TTHoves-Medium, TTHoves"
            fontWeight="500"
            color="#000000"
          >
            {data && renderNmtNumberText(`${data?.balance?.balance}`)}
            <Text ml="3px" color="#999999">NMT</Text>
            <Box ml="20px" display="inline-block" as="img" src={SelectIcon.default} w="32px" h="32px" />
          </Box>
        </Box>
      )}
      {index !== length - 1 && <Divider />}
    </>
  );
};

interface AccountListProps {
  InjectedAccountList: InjectedAccountWithMeta[];
  handleClick: (index: number) => Promise<void>;
}

const AccountList: React.FC<AccountListProps> = ({ InjectedAccountList, handleClick }) => (
  <>
    {InjectedAccountList.map((account, index) => (
      <Account
        key={account.address}
        handleClick={handleClick}
        address={account.address}
        index={index}
        length={InjectedAccountList.length}
        InjectedAccountList={InjectedAccountList}
      />
    ))}
  </>
);

export default AccountList;
