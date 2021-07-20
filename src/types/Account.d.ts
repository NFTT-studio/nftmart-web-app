type Account = {
  name: string,
  address: string,
  balance: {
    free: string,
    reserved: string,
    miscFrozen: string
  },
  ownerNftscount: number,
  createdNftCount: number,
  createdClassCount: number
}
