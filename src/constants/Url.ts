import { statusArr } from './Status';

export const NODE_URL = 'ws://81.70.132.13:9966/';
export const PINATA_POST_SERVER = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
export const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';
export const GRAPHQL_ENDPOINT = 'https://api.subquery.network/sq/subqns/nftmart-beta-4';
export const CACHE_SERVER_URL = 'http://test-cache.bcdata.top/api/';
// export const CACHE_SERVER_URL = 'http://test-cache.bcdata.top/api/';
export const IPFS_URL = 'https://ipfs-web.bcdata.top/ipfs/';
export const DBURL = 'http://localhost:8888/graphql';
export const IPFS_POST_SERVER = 'https://ipfs-api.bcdata.top';// ipfs node
export const IPFS_GET_SERVER = 'https://ipfs-web.bcdata.top/ipfs/';// query with cid server
export const PINATA_SERVER = 'https://ipfs-web.bcdata.top/ipfs/'; // query with cid server
export const UPLOAD_PINATA_SERVER = 'https://gateway.pinata.cloud/ipfs/';
export const UPLOAD_OWN_SERVER = 'https://ipfs-api.bcdata.top/api/v0/add?stream-channels=true&pin=true&progress=true&wrap-with-directory=false';
export const EXPLORER_URL = 'http://81.70.132.13/#/explorer';

export const NAV_MAP = [
  {
    title: 'navHome',
    path: '/',
    requiredLogin: false,
    requiredWhitelist: false,
  },
  {
    title: 'navBrowing',
    path: '/browsing',
    requiredLogin: false,
    requiredWhitelist: false,
  },
  {
    title: 'navListSale',
    path: `/browsing?status=${statusArr[2]}`,
    requiredLogin: false,
    requiredWhitelist: false,
  },
  {
    title: 'navAuction',
    path: `/browsing?status=${statusArr[1]}`,
    requiredLogin: false,
    requiredWhitelist: false,
  },
  // {
  //   title: 'navActive',
  //   path: '/active',
  //   requiredLogin: false,
  //   requiredWhitelist: false,
  // },
  {
    title: 'navCreate',
    path: '/profile/collection/create',
    requiredLogin: true,
    requiredWhitelist: true,
  },
];

// online

export const MAX_FILE_SIZE = 1024 * 1024 * 10;
