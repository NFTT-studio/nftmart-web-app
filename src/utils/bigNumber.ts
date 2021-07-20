import BigNumber from 'bignumber.js';

export const toBigNumber = (n: NumberValue) => new BigNumber(String(n));
