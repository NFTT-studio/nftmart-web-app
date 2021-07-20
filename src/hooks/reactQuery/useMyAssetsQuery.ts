import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../constants/QueryKeys';
import { getAllOrders } from '../../polkaSDK/api/getAllOrders';
import { queryNftByAddress } from '../../polkaSDK/api/queryNftByAddress';
import { Order, Work } from '../../polkaSDK/types';

export const useMyAssetsQuery = (address: string) => {
  // helpers
  const updateAssetByOrder = (asset: Work, orders: Order[]) => {
    const givenOrder = orders.find(
      (order) => order.classId === asset.classId && order.tokenId === asset.tokenId,
    );

    if (givenOrder) {
      const categoryId = givenOrder.categoryId ? Number(givenOrder.categoryId) : 3;
      return {
        ...asset,
        status: 1,
        price: givenOrder.price,
        pledge: givenOrder.deposit,
        categoryId,
      };
    }
    return {
      ...asset, status: 2, price: undefined, categoryId: -1,
    };
  };

  const queryAssetsAndMap = async () => {
    if (!address) return [];
    let assets = (await queryNftByAddress({ address })) as Work[];
    const orders = (await getAllOrders()) as Order[];

    if (Array.isArray(orders) && Array.isArray(assets)) {
      assets = assets.map((asset) => updateAssetByOrder(asset, orders));
    }

    const sortedAssets = assets.sort((a, b) => {
      // b up first if a is not listing
      if (a.status !== 1) return 1;
      // vice versa
      if (b.status !== 1) return -1;

      const aDps = parseFloat(a.pledge!);
      const bDps = parseFloat(b.pledge!);
      return bDps - aDps;
    });

    return sortedAssets;
  };

  return useQuery<Work[]>([QUERY_KEYS.MY_ASSETS_QUERY, address], queryAssetsAndMap as any);
};
