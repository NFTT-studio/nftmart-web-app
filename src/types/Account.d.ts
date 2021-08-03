type Account = {
  name: string,
  address: string,
  balance: {
    balance: string
    bonded: string
    feeFrozen: string
    free: string
    locked: string
    miscFrozen: string
    reserved: string
    transferrable: string
  },
  ownerNftscount: number,
  createdNftCount: number,
  createdClassCount: number
}
