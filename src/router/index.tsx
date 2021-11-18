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
        <Route exact strict path="/collection/:collectionId-:collectionName" component={Collection} />
        <Route exact strict path="/items/:collectionId-:nftId-:nftName" component={Detail} />
        <Route exact strict path="/account/:address/wallet" component={Account} />
        <Route exact strict path="/account/:address-:username/owned" component={Account} />
        <Route exact strict path="/account/:address-:username/created" component={Account} />
        <Route exact strict path="/account/:address-:username/Stars" component={Account} />
        <Route exact strict path="/account/:address-:username/Offers" component={Account} />
        <Route exact strict path="/account/:address-:username/collections" component={Account} />
        <Route exact strict path="/account/:address/owned" component={Account} />
        <Route exact strict path="/account/:address/created" component={Account} />
        <Route exact strict path="/account/:address/Stars" component={Account} />
        <Route exact strict path="/account/:address/Offers" component={Account} />
        <Route exact strict path="/account/:address/collections" component={Account} />
        <Route exact strict path="/account/owned" component={Account} />
        <Route exact strict path="/account/created" component={Account} />
        <Route exact strict path="/account/stars" component={Account} />
        <Route exact strict path="/account/offers" component={Account} />
        <Route exact strict path="/account/collections" component={Account} />
        <Route exact strict path="/account/collections/create" component={CreateCollection} />
        <Route exact strict path="/account/items/create:collectionId" component={CreateNft} />
        <Route exact strict path="/account/profile/settings" component={EditProfile} />
        <Route exact strict path="/:nftId/sellSetting" component={SellSetting} />
      </Switch>
    </PolkaProvider>
    <Footer />
  </Router>
);
