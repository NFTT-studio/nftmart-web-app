/* eslint-disable max-len */
const NODE_URLPROD = 'wss://mainnet.nftmart.io/rpc/ws';
const NODE_URLTEST = 'wss://staging.nftmart.io/rpc/ws';
export const NODE_URL = `${1 ? NODE_URLPROD : NODE_URLTEST}`;
export const PINATA_POST_SERVER = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
export const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';
export const GRAPHQL_ENDPOINT = 'https://api.subquery.network/sq/subqns/nftmart-beta-4';
const CACHE_SERVER_URLPROD = 'https://cache.nftmart.io/api/';
const CACHE_SERVER_URLTEST = 'https://test-cache.nftmart.io/api/';
export const CACHE_SERVER_URL = `${1 ? CACHE_SERVER_URLPROD : CACHE_SERVER_URLTEST}`;
export const IPFS_URL = 'https://ipfs-web.bcdata.top/ipfs/';
export const DBURL = 'http://localhost:8888/graphql';
export const IPFS_POST_SERVER = 'https://ipfs-api.bcdata.top';// ipfs node
export const IPFS_GET_SERVER = 'https://ipfs-web.bcdata.top/ipfs/';// query with cid server
export const PINATA_SERVER = 'https://res.nftmart.io/'; // query with cid server
// export const PINATA_SERVER = 'https://ipfs-web.bcdata.top/ipfs/'; // query with cid server
export const UPLOAD_PINATA_SERVER = 'https://gateway.pinata.cloud/ipfs/';
// eslint-disable-next-line max-len
export const UPLOAD_OWN_SERVER = 'https://ipfs-api.bcdata.top/api/v0/add?stream-channels=true&pin=true&progress=true&wrap-with-directory=false';
export const EXPLORER_URL = 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fstaging-ws.nftmart.io#/accounts';
const REACT_APP_GAPROD = 'UA-197448335-4';
const REACT_APP_GATEST = 'UA-197448335-5';
export const REACT_APP_GA = `${window.location.origin === 'https://app.nftmart.io' ? REACT_APP_GAPROD : REACT_APP_GATEST}`;
// online

export const MAX_FILE_SIZE = 1024 * 1024 * 100;
