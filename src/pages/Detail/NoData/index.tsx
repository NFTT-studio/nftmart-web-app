import React, { FC } from 'react';
import {
  Flex,
  Image,
  Text,
  AccordionPanel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import {
  Historyempty,
} from '../../../assets/images';

interface Props {
  widths: string,
}
const NoData: FC<Props> = (({
  widths,
}) => {
  const { t } = useTranslation();
  return (
    <Flex p="0px">
      <Flex
        // eslint-disable-next-line react/destructuring-assignment
        width={widths}
        height="260px"
        background="#FFFFFF"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          w="150px"
          h="100px"
          borderStyle="dashed"
          src={Historyempty.default}
        />
        <Text
          mt="10px"
          fontSize="14px"
          fontFamily="TTHoves-Regular, TTHoves"
          fontWeight="400"
          color="#999999"
          lineHeight="20px"
        >
          {t('Detail.noDataYet')}
        </Text>
      </Flex>
    </Flex>
  );
});
export default NoData;
