/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { bnToBn } from '@polkadot/util';
import { unit as UnitBn } from '../polkaSDK/utils/unit';
import { toBigNumber } from './bigNumber';

export const baseOptions = [
  { power: 0, text: 'TEST', value: '-' },
  { power: 3, text: 'Kilo', value: 'k' },
  { power: 6, text: 'Mill', value: 'M' },
  { power: 9, text: 'Bill', value: 'B' },
  { power: 12, text: 'Tril', value: 'T' },
  { power: 15, text: 'Peta', value: 'P' },
  { power: 18, text: 'Exa', value: 'E' },
  { power: 21, text: 'Zeta', value: 'Z' },
  { power: 24, text: 'Yotta', value: 'Y' },
];

export const parseMoneyText = (text: string) => {
  const cutUnit = text.substring(0, text.length - 3);

  const baseOption = baseOptions.find((option) => cutUnit.includes(option.value)) || baseOptions[0];

  const [moneyText, unit] = text.replace(baseOption.value, '').split(' ');
  const normalizedMoney = toBigNumber(moneyText).times(10 ** baseOption.power);
  return { value: normalizedMoney, unit };
};

export const extractBalanceText = (balanceText: string) => {
  const { value, unit } = parseMoneyText(balanceText);
  return {
    integer: value.toString().split('.')[0],
    decimal: value.toString().split('.')[1],
    unit,
  };
};

export const priceStringDivUnit = (priceString: string) => {
  const nmtBn = toBigNumber(priceString).div(UnitBn.toNumber());
  return nmtBn.toString();
};

export const nmtNumberToString = (nmtNumber: string) => {
  const nmtBn = toBigNumber(nmtNumber).div(UnitBn.toNumber());
  const millBn = toBigNumber(10 ** baseOptions[2].power);
  if (nmtBn.gte(millBn)) {
    return `${nmtBn.div(millBn).toFixed(3).toString()} M`;
  }
  return nmtBn.toFixed(1).toString();
};
export const NumberToString = (nmtNumber: string) => {
  const nmtBn = toBigNumber(nmtNumber).div(UnitBn.toNumber());
  return nmtBn.toString();
};
export const toFixedDecimals = (n: NumberValue, place = 8) => toBigNumber(n).toFormat(place);
export const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
export const currentPrice = (maxPrice: number, minPrice: number, deadline: number, currentBlock: number, createdBlock:number) => {
  if (deadline < currentBlock) {
    return priceStringDivUnit(minPrice.toString());
  }
  if (Math.floor((deadline - createdBlock) / 300) === 0) {
    return priceStringDivUnit(maxPrice.toString());
  }
  // eslint-disable-next-line no-mixed-operators
  const downPrice = maxPrice - Math.ceil((maxPrice - minPrice) * Math.floor((currentBlock - createdBlock) / 300) / Math.floor((deadline - createdBlock) / 300));

  return nmtNumberToString(downPrice.toString());
};
export const formatNum = (num) => {
  num = Number(num).toFixed(1).toString();
  const numArr = num.split('.');
  num = numArr[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  result = `${result}.${numArr[1] || 0}`;
  return result;
};
