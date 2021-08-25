import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Connect from '../pages/Connect';
import Home from '../pages/Home';
import CreateCollection from '../pages/CreateCollection';
import PolkaProvider from '../polkaSDK/PolkaProvider';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Browsing from '../pages/Browsing';
import CreateNft from '../pages/CreateNft';
import Detail from '../pages/Detail';
import SellSetting from '../pages/SellSetting';
import Collection from '../pages/Collection';
import Account from '../pages/Account';
import EditProfile from '../pages/ProfileEdit';

export default () => (
  <Router>
    <Header />
    <PolkaProvider>
      <Switch>
        <Route exact strict path="/" component={Home} />
        <Route exact strict path="/browsing" component={Browsing} />
        <Route exact strict path="/connect" component={Connect} />
        <Route exact strict path="/collection/:address" component={Collection} />
        <Route exact strict path="/item/:nftId" component={Detail} />
        <Route exact strict path="/account/:address/wallet" component={Account} />
        <Route exact strict path="/account/:address/collections" component={Account} />
        <Route exact strict path="/profile/collection/create" component={CreateCollection} />
        <Route exact strict path="/profile/nft/create/:collectionId" component={CreateNft} />
        <Route exact strict path="/profile" component={EditProfile} />
        <Route exact strict path="/sellSetting/:nftId" component={SellSetting} />
      </Switch>
    </PolkaProvider>
    <Footer />
  </Router>
);
