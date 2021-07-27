import React, { FC } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Divider,
  Text,
  Flex,
  Stack,
  Box,
} from '@chakra-ui/react';
import { map } from 'ramda';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../constants';
import { baseOptions, parseMoneyText } from '../../utils/format';

export interface BalanceType {
  feeFrozen: string;
  free: string;
  miscFrozen: string;
  reserved: string;
}

export const renderBalanceText = (balanceText: string) => {
  if (!balanceText || typeof balanceText !== 'string') return null;

  const { value, unit } = parseMoneyText(balanceText);
  const [integer, decimal] = value.toString().split('.');

  return (
    <Flex display="inline-flex">
      <Text fontSize="sm" fontWeight="bold" color={Colors.Primary}>
        {integer}
        {decimal ? '.' : ''}
      </Text>
      <Text fontSize="sm" color={Colors.TextGray} marginRight={1}>
        {decimal}
      </Text>
      <Text fontSize="sm" color={Colors.Primary}>
        {unit}
      </Text>
    </Flex>
  );
};

export const renderBalanceFreeText = (balanceText: string) => {
  if (!balanceText || typeof balanceText !== 'string') return null;
  const capBalanceText = balanceText.toUpperCase();
  const [amount, unit] = capBalanceText.split(' ');
  const [integer, decimal] = amount.toString().split('.');
  return (
    <Flex display="inline-flex">
      <Text fontSize="sm" fontWeight="bold" color={Colors.Primary}>
        {integer}
        {decimal ? '.' : ''}
      </Text>
      <Text fontSize="sm" color={Colors.TextGray} marginRight={1}>
        {decimal && decimal.substring(0, 1)}
      </Text>
      <Text fontSize="sm" color={Colors.Primary}>
        {unit}
      </Text>
    </Flex>
  );
};

const availableBalanceKeys: (keyof BalanceType)[] = ['free', 'reserved'];
export interface BalanceProps {
  balance?: BalanceType | null;
}

const Balance: FC<BalanceProps> = ({ balance }) => {
  const { t } = useTranslation();

  if (!balance) return null;

  const renderContentText = (key: keyof BalanceType) => {
    const balanceText = balance[key];

    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between" key={key}>
        <Text fontSize="sm">
          {t(`balance.${key}`)}
          :
        </Text>
        {' '}
        <Flex>{renderBalanceText(balanceText)}</Flex>
      </Stack>
    );
  };

  const triggerContent = (
    <Flex cursor="pointer">
      <Divider
        orientation="vertical"
        borderColor={Colors.TextBlack}
        marginRight={2}
        height="18px"
      />
      {renderBalanceText(balance.free)}
    </Flex>
  );

  const contentNode = <Box padding={4}>{map(renderContentText, availableBalanceKeys)}</Box>;

  return (
    <Popover trigger="hover" variant="menu">
      <PopoverTrigger>{triggerContent}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{contentNode}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Balance;
