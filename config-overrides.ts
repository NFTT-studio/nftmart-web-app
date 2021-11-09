const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = (config, env) => {
  if (env === 'production') {
    config.plugins = config.plugins.concat([
      new PrerenderSPAPlugin({
        routes: ['/',
          '/browsing',
          '/connect',
          '/collection/:address',
          '/item/:nftId',
          '/account/:address/wallet',
          '/account/:address/collections',
          '/profile/collection/create',
          '/profile/nft/create/:collectionId',
          '/profile',
          '/sellSetting/:nftId'],
        staticDir: path.join(__dirname, 'build'),
      }),
    ]);
  }

  return config;
};
