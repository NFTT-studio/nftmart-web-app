/* eslint-disable camelcase */
type Order = {
  buyer_id: string | null,
  category: Category,
  category_id: string,
  class: Collection,
  currency_id: number | null,
  deadline: number,
  deposit: string,
  id: string,
  metadata: Metadata,
  name: string,
  nft: Nft,
  price: string,
  seller_id: string,
  status_id: 'Created' | 'Cancelled' | 'Completed'
}
