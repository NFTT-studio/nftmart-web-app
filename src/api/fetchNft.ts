/* eslint-disable camelcase */
import axiosClient from '../apiClient/axiosClient';

type NftData = {
  nftInfo: {
    burned: string | null
    class_id: string
    creator_id: string
    deposit: string | null
    id: string
    metadata: Metadata
    description: string
    logoUrl: string
    name: string
    nftMartUrl: string
    url: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offers: any[]
    order_status: string
    owner_id: string
    price: string
    quantity: number
    royalty: boolean
    status: Status
    token_id: string
    category: []
    order_id: string
  }
}

export default async (id: string) => {
  const res = await axiosClient.get<NftData>(`/nfts/detail/${id}`);
  return res.data;
};
