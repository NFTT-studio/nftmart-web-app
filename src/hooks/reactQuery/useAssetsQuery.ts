import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../constants/QueryKeys';
import PolkaSDK from '../../polkaSDK';
import { getAllNfts } from '../../polkaSDK/api/getAllNfts';
import { getAllOrders } from '../../polkaSDK/api/getAllOrders';
import { Order, Work } from '../../polkaSDK/types';
import { parseMoneyText } from '../../utils/format';

export const useAssetsQuery = () => {
  // ----- helpers
  const updateAssetByOrder = (asset: Work, orders: Order[], blockNumber: number) => {
    const givenOrder = orders.find(
      (order) => order.classId === asset.classId && order.tokenId === asset.tokenId,
    );

    if (givenOrder) {
      const deadline = +givenOrder.deadline.replace(/,/g, '');
      if (blockNumber < deadline) {
        const categoryId = givenOrder.categoryId ? Number(givenOrder.categoryId) : -1;
        return {
          ...asset,
          status: 1,
          price: givenOrder.price,
          pledge: givenOrder.deposit,
          categoryId,
        };
      }
    }
    return {
      ...asset, status: 2, price: undefined, categoryId: -1, pledge: undefined,
    };
  };

  const queryAssetsAndMap = async () => {
    let assets = await getAllNfts();
    const orders = (await getAllOrders()) as Order[];
    const blockNumber = Number(await PolkaSDK.api.query.system.number());

    if (Array.isArray(orders) && Array.isArray(assets)) {
      assets = assets.map((asset) => updateAssetByOrder(asset, orders, blockNumber));
    }

    const sortedAssets = assets.sort((a, b) => {
      // b up first if a is not listing
      if (a.status !== 1) return 1;
      // vice versa
      if (b.status !== 1) return -1;

      const { value: aPrice } = parseMoneyText(a.price as string);
      const { value: bPrice } = parseMoneyText(b.price as string);
      const aDps = parseFloat(aPrice.toString());
      const bDps = parseFloat(bPrice.toString());

      return aDps - bDps;
    });

    return sortedAssets;
  };

  return useQuery<Work[]>(QUERY_KEYS.ASSETS_QUERY, queryAssetsAndMap);
};
