import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';

interface ChainState {
  whiteList: string[],
  accounts: InjectedAccountWithMeta[],
  account: InjectedAccountWithMeta | null,
  injector: InjectedExtension | null
}

const initialState: ChainState = {
  whiteList: [],
  accounts: [],
  account: null,
  injector: null,
};

export const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setWhiteList: (state, action: PayloadAction<string[]>) => {
      state.whiteList = action.payload;
    },
    setAccounts: (state, action: PayloadAction<InjectedAccountWithMeta[]>) => {
      state.accounts = action.payload;
    },
    setAccount: (state, action: PayloadAction<InjectedAccountWithMeta>) => {
      state.account = action.payload;
    },
    setInjector: (state, action: PayloadAction<InjectedExtension>) => {
      state.injector = action.payload;
    },
  },
});

export const {
  setWhiteList,
  setAccounts,
  setAccount,
  setInjector,
} = chainSlice.actions;

export default chainSlice.reducer;
